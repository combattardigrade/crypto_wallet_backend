const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance
const PaymentRequest = require('../models/sequelize').PaymentRequest
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')

module.exports.createPaymentRequest = (req, res) => {
    const userId = req.user.id
    const requestToUserId = req.body.requestToUserId
    const amount = parseFloat(req.body.amount)
    const currency = req.body.currency
    const operationType = 'INTERNAL_TRANSFER'
    const reason = req.body.reason
    const description = req.body.description
    const status = 'PENDING_APPROVAL'

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }
    
    if (!requestToUserId || !amount || !currency || !operationType || !reason || !description) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter all the required fields' })
        return
    }

    if (isNaN(amount) || amount < 0) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a valid amount' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        const tx = await PaymentRequest.create({
            userId,
            requestToUserId,
            amount,
            currency,
            operationType,
            reason,
            description,
            status
        }, { transaction: t })

        if (!tx) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred while creating the payment request' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: tx, message: 'Payment request created' })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.getPaymentRequests = (req, res) => {
    const userId = req.user.id
    const status = req.params.status ? req.params.status : 'ALL'

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        let results
        if (status == 'ALL') {
            results = await PaymentRequest.findAll({
                where: {
                    requestToUserId: userId,
                },
                transaction: t
            })
        } else {
            results = await PaymentRequest.findAll({
                where: {
                    requestToUserId: userId,
                    status
                },
                transaction: t
            })
        }

        if (!results) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'No payment requests found' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: results })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.updatePaymentRequest = (req, res) => {
    const userId = req.user.id
    const requestId = req.body.requestId
    const amount = req.body.amount
    const currency = req.body.currency
    const operationType = req.body.operationType
    const reason = req.body.reason
    const description = req.body.description
    const status = req.body.status

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!requestId || !amount || !currency || !operationType || !reason || !description || !status) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter all the required fields' })
        retunr
    }

    if (isNaN(amount) || amount < 0) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a valid amount' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        const paymentRequest = await PaymentRequest.findOne({
            where: {
                userId,
                id: requestId
            },
            transaction: t
        })

        if (!paymentRequest) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Payment request not found' })
            return
        }

        paymentRequest.amount = amount
        paymentRequest.currency = currency
        paymentRequest.operationType = operationType
        paymentRequest.reason = reason
        paymentRequest.description = description
        paymentRequest.status = status

        await paymentRequest.save({ transaction: t })

        sendJSONresponse(res, 200, { status: 'OK', payload: paymentRequest })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.deletePaymentRequest = (req, res) => {
    const userId = req.user.id
    const requestId = req.params.requestId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!requestId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter all the required fields' })
        retunr
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        const paymentRequest = await PaymentRequest.findOne({
            where: {
                userId,
                id: requestId
            },
            transaction: t
        })

        if (!paymentRequest) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Payment request not found' })
            return
        }

        await PaymentRequest.destroy({
            where: {
                userId,
                id: requestId
            },
            transaction: t
        })

        sendJSONresponse(res, 200, { status: 'OK', message: 'Payment request deleted' })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.getPaymentRequest = (req, res) => {
    const userId = req.user.id
    const requestId = req.params.requestId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!requestId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter all the required fields' })
        retunr
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        const paymentRequest = await PaymentRequest.findOne({
            where: {
                userId,
                id: requestId
            },
            transaction: t
        })

        if (!paymentRequest) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Payment request not found' })
            return
        }        

        sendJSONresponse(res, 200, { status: 'OK', payload: paymentRequest })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}
