const User = require('../models/sequelize').User
const TxReason = require('../models/sequelize').TxReason
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')

module.exports.createTxReason = (req, res) => {
    const userId = req.user.id
    const reason = req.body.reason

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
                userType: 'admin'
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        const txReason = await TxReason.create({
            reason,
        }, { transaction: t})
        

        sendJSONresponse(res, 200, { status: 'OK', payload: txReason })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}


module.exports.getTxReasons = (req, res) => {
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

        const txReasons = await TxReason.findAll({            
            transaction: t
        })

        sendJSONresponse(res, 200, { status: 'OK', payload: txReasons })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}



