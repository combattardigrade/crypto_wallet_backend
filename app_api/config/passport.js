const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance
const UserAddress = require('../models/sequelize').UserAddress
const KeycloakBearerStrategy = require('passport-keycloak-bearer')
const ethWallet = require('ethereumjs-wallet')
const sequelize = require('../models/sequelize').sequelize


passport.use(new localStrategy({ usernameField: 'email' }, function (email, password, next) {
    User.findOne({ where: { email: email } })
        .then(function (user) {
            if (!user) {
                return next(null, false, { status: 'ERROR', message: 'The user does not exist or you entered incorrect credentials' })
            }
            if (!user.validPassword(password)) {
                return next(null, false, { status: 'ERROR', message: 'The user does not exist or you entered incorrect credentials' })
            }
            if (user.active == 'INACTIVE') {
                return next(null, false, { status: 'ERROR', message: 'The account is not active' })
            }
            const token = user.generateJwt()
            return next(null, token)
        })
}))

passport.use(new KeycloakBearerStrategy({
    "realm": process.env.KEYCLOAK_REALM, // "demo"
    "url": process.env.KEYCLOAK_URL // "http://localhost:8080/auth"
}, (jwtPayload, next) => {
    console.log(jwtPayload)

    if(!jwtPayload) {
        return next(null, false, { status: 'ERROR', message: 'Keycloak token not received'})
    }

    if( !jwtPayload.email || !jwtPayload.given_name || !jwtPayload.family_name || !jwtPayload.preferred_username) {
        return next(null, false, { status: 'ERROR', message: 'The keycloak user does not have email, username or full name set up' })
    }

    sequelize.transaction(async (t) => {
        const [user, created] = await User.findOrCreate({
            where: {
                email: jwtPayload.email,
            },
            defaults: {
                firstName: jwtPayload.given_name,
                lastName: jwtPayload.family_name,
                email: jwtPayload.email,
                username: jwtPayload.preferred_username,
            },
            transaction: t
        })

        const token = user.generateJwt()

        if (!created) {
            if (user.active === 'INACTIVE') {
                return next(null, false, { status: 'ERROR', message: 'The account is not active' })
            }
            return next(null, token)
        }

        await Balance.create({
            userId: user.id,
            amount: 0,
            currency: 'JWS'
        }, { transaction: t })

        // Generate Ethereum address
        const addressData = ethWallet.generate()
        await UserAddress.create({
            userId: user.id,
            address: addressData.getAddressString(),
            privateKey: addressData.getPrivateKeyString()
        }, { transaction: t })

        return next(null, token)
    })
        .catch((err) => {
            console.log(err)
            return next(null, false, { status: 'ERROR', message: 'An error occurred. Please try again' })
        })
}))