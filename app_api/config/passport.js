const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/sequelize').User
const KeycloakBearerStrategy = require('passport-keycloak-bearer')


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
    User.findOne({ where: { email: jwtPayload.email } })
        .then((user) => {               
            if(!user) {
                return next(null, false, { status: 'ERROR', message: 'The user does not exist or you entered incorrect credentials' })
            }
            if(user.active === 'INACTIVE') {
                return next(null, false, { status: 'ERROR', message: 'The account is not active'})
            }
            
            const token = user.generateJwt()
            return next(null, token)
        })  
}))