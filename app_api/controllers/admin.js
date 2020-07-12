const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance
const sendJSONresponse = require('../utils').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize');


module.exports.addFundsToUser = (req, res) => {
    const adminId = req.user.id
    const userId = req.body.userId
    const amount = parseFloat(req.body.amount)
    const currency = req.body.currency

    if (!adminId || !userId || !amount || !currency) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required fields' })
        return
    }

    if (isNaN(amount) || amount <= 0) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a valid amount' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId
            },
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res, 404, { status: 'The user does not exist'})
            return
        }

        const balance = await Balance.findOne({
            where: {
                userId,
                currency,
            },
            transaction: t
        })

        balance.amount = parseFloat(balance.amount) + amount
        await balance.save({ transaction: t })

        sendJSONresponse(res, 200, { status: 'OK', payload: balance, message: 'Funds correctly added to user\'s balance'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 422, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.deductFundsFromUser = (req, res) => {
    const adminId = req.user.id
    const userId = req.body.userId
    const amount = parseFloat(req.body.amount)
    const currency = req.body.currency

    if (!adminId || !userId || !amount || !currency) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required fields' })
        return
    }

    if (isNaN(amount) || amount <= 0) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a valid amount' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId
            },
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res, 404, { status: 'The user does not exist'})
            return
        }

        const balance = await Balance.findOne({
            where: {
                userId,
                currency,
            },
            transaction: t
        })

        balance.amount = parseFloat(balance.amount) - amount
        await balance.save({ transaction: t })

        sendJSONresponse(res, 200, { status: 'OK', payload: balance, message: 'Funds correctly deducted from user\'s balance'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 422, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.overrideUserBalance = (req, res) => {
    const adminId = req.user.id
    const userId = req.body.userId
    const newBalance = parseFloat(req.body.newBalance)
    const currency = req.body.currency

    if (!adminId || !userId || !newBalance || !currency) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required fields' })
        return
    }

    if (isNaN(newBalance) || newBalance <= 0) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter a valid amount' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId
            },
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res, 404, { status: 'The user does not exist'})
            return
        }

        const balance = await Balance.findOne({
            where: {
                userId,
                currency,
            },
            transaction: t
        })

        balance.amount = newBalance
        await balance.save({ transaction: t })

        sendJSONresponse(res, 200, { status: 'OK', payload: balance, message: 'User\'s balance correctly updated'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 422, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}