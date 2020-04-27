const User = require('../models/sequelize').User
const RegistrationKey = require('../models/sequelize').RegistrationKey
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const moment = require('moment')
const crypto = require('crypto')

// Push Notifications Config
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../../firebaseAccountKey.json')

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://jiwards.firebaseio.com/"
})



module.exports.sendNotification = async (title, message, userId, type = 'PAYMENT_RECEIVED') => {

    const registrationKey = await RegistrationKey.findOne({ where: { userId } })

    const notification = {
        data: {
            title,
            body: message,
            type,
        },
        notification: {
            title,
            body: message,
        },
        token: registrationKey.registrationId
    }

    // Send notification to one device
    const response = await firebaseAdmin.messaging().send(notification)

    return response;
}

module.exports.testNotification = (req, res) => {
    const userId = req.body.userId
    const title = req.body.title
    const message = req.body.message

    if (!userId || !title || !message) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required arguments' })
        return
    }

    sequelize.transaction(async (t) => {
        const registrationKey = await RegistrationKey.findOne({ where: { userId }, transaction: t })

        if (!registrationKey) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Registration Key not found' })
            return
        }
        
        const notification = {
            data: {
                title,
                body: message,
            },
            notification: {
                title,
                body: message,
            },
            token: registrationKey.registrationId
        }

        // Send notification to one device
        const response = await firebaseAdmin.messaging().send(notification)
        console.log(response)

        sendJSONresponse(res, 200, { status: 'OK', message: 'Push notification sent' })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 422, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.saveRegistrationId = (req, res) => {
    const userId = req.user.id
    const registrationId = req.body.registrationId

    if (!userId || !registrationId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required arguments' })
        return
    }

    sequelize.transaction(async (t) => {
        const [registrationKey, created] = await RegistrationKey.findOrCreate({
            where: {
                id: userId,
            },
            defaults:{
                userId,
                registrationId
            },
            transaction: t
        })

        if(!created) {
            registrationKey.registrationId = registrationId
            await registrationKey.save({ transaction: t })            
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: registrationKey, message: 'Registration ID saved'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 422, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}