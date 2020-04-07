const passport = require('passport')
const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance

const sequelize = require('../models/sequelize').sequelize
const crypto = require('crypto')
const emailValidator = require('email-validator')
const sendJSONresponse = require('../utils').sendJSONresponse
const passwordValidator = require('password-validator')
const passwordSchema = new passwordValidator()
passwordSchema
    .is().min(4) // minimun length 6
    .has().digits() // must have digits
    .has().not().spaces() // should not have spaces


module.exports.signup = (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const rpassword = req.body.rpassword

    if (!firstName || !lastName || !email || !username || !password || !rpassword) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter all the required fields' })
        return
    }

    // email validation
    if (!emailValidator.validate(email)) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a valid email' })
        return
    }

    // password validation
    if (!passwordSchema.validate(password)) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a password of at least 4 characters that contains at least one number' })
        return
    }

    sequelize.transaction(async (t) => {

        return User.findOrCreate({
            where: {                
                email,
            },
            defaults: {
                firstName,
                lastName,
                email,
                username,
            },
            transaction: t
        })
            .spread(async (user, created) => {
                if (!created) {
                    sendJSONresponse(res, 422, { status: 'ERROR', message: 'The user already exists' })
                    return
                }

                user.setPassword(password)
                const token = user.generateJwt()
                await user.save({ transaction: t })

                await Balance.create({
                    userId: user.id,
                    amount: 0,
                    currency: 'JWS'
                }, { transaction: t })


                sendJSONresponse(res, 200, { status: 'OK', token: token, message: 'Account created' })
                return

            })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter all the required fields' })
        return
    }

    passport.authenticate('local', function (err, token, info) {
        if (err) {
            sendJSONresponse(res, 404, err)
            return
        }
        if (token) {
            sendJSONresponse(res, 200, { status: 'OK', token: token })
            return
        }
        sendJSONresponse(res, 401, info)
        return
    })(req, res)
}