const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance
const Transaction = require('../models/sequelize').Transaction
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')

module.exports.getAllTxs = (req, res) => {
    const userId = req.user.id

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

        const txs = await Transaction.findAll({
            where: {
                $or: [
                    {
                        userId: { $eq: userId }
                    },
                    {
                        toUserId: { $eq: userId }
                    }
                ],
                operationType: 'INTERNAL_TRANSFER',
                status: 'COMPLETED'
            },
            order: [
                ['createdAt', 'DESC']
            ],
            raw: true,
            transaction: t
        })

        const usersArray = []
        for (let tx of txs) {
            let from = User.findOne({ where: { id: tx.userId }, transaction: t, raw: true, attributes: ['id', 'firstName', 'lastName', 'username', 'email'] })
            let to = User.findOne({ where: { id: tx.toUserId }, transaction: t, raw: true, attributes: ['id', 'firstName', 'lastName', 'username', 'email'] })
            usersArray.push(from)
            usersArray.push(to)
        }

        const users = await Promise.all(usersArray)
        let payload = []
        let i = 0
        for (let tx of txs) {
            payload.push({
                ...tx,
                from: {
                    ...users[i]
                },
                to: {
                    ...users[i+1]
                }
            })
            i++
            i++
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: payload })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.getRankingsByPeriod = (req, res) => {
    const userId = req.user.id
    const period = req.params.period

    if (!userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!period) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter all the required params' })
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

        let date
        if (period === 'week') {
            date = moment().subtract('7', 'days')
        } else if (period === 'month') {
            date = moment().subtract('30', 'days')
        } else if (period === 'year') {
            date = moment().subtract('365', 'days')
        }

        let rankings = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.gte]: date
                }
            },
            attributes: [
                'id', ['toUserId', 'userId'],
                [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
            ],
            group: ['toUserId'],
            limit: 50,
            raw: true,
            transaction: t
        })

        rankings = rankings.sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount))

        let usersRequests = []
        for (let r of rankings) {
            let u = User.findOne({
                where: {
                    id: r.userId,
                },
                attributes: ['id', 'email', 'firstName', 'lastName', 'username'],
                raw: true,
                transaction: t
            })
            usersRequests.push(u)
        }

        let users = await Promise.all(usersRequests)
        let payload = []
        let i = 0
        for (let r of rankings) {
            payload.push({
                ...r,
                user: {
                    ...users[i]
                }
            })
            i++
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: payload })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })

}

module.exports.sendInternalTx = (req, res) => {
    const userId = req.user.id
    const toUserId = req.body.toUserId
    const amount = parseFloat(req.body.amount)
    const currency = req.body.currency
    const operationType = 'INTERNAL_TRANSFER'
    const reason = req.body.reason
    const description = req.body.description


    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!toUserId || !amount || !currency || !operationType || !reason || !description) {
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

        const fromBalance = await Balance.findOne({
            where: {
                userId,
                currency: 'JWS'
            },
            transaction: t
        })

        const toBalance = await Balance.findOne({
            where: {
                userId: toUserId,
                currency: 'JWS'
            },
            transaction: t
        })

        if (!fromBalance || !toBalance) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred while trying update the balances' })
            return
        }

        fromBalance.amount = parseFloat(fromBalance.amount) - parseFloat(amount)
        toBalance.amount = parseFloat(toBalance.amount) + parseFloat(amount)

        await fromBalance.save({ transaction: t })
        await toBalance.save({ transaction: t })

        const tx = await Transaction.create({
            userId,
            toUserId,
            amount,
            currency,
            operationType,
            reason,
            description,
            status: 'COMPLETED'
        })

        sendJSONresponse(res, 200, { status: 'OK', payload: tx, message: 'Transaction completed correctly' })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}
