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
                ]
            },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName', 'username', 'email'] }
            ],
            transaction: t
        })

        sendJSONresponse(res, 200, { status: 'OK', payload: txs })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
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
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })

}

