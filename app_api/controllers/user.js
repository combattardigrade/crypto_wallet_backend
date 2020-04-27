const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance
const UserAddress = require('../models/sequelize').UserAddress
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')


module.exports.getUserData = (req, res) => {
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
            attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'userType', 'status','createdAt','updatedAt'],
            include: [
                { model: Balance },   
                { model: UserAddress, attributes: ['id', 'userId', 'address', 'createdAt', 'updatedAt'] }                           
            ],
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: user })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}


module.exports.getUserDetails = (req, res) => {
    const userId = req.params.userId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,                
            },
            attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'userType', 'status','createdAt','updatedAt'],
            include: [
                { model: Balance },   
                { model: UserAddress, attributes: ['id', 'userId', 'address', 'createdAt', 'updatedAt'] }                           
            ],
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: user })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.adminGetUserDataByEmail = (req, res) => {
    const email = req.params.email

    if (!email) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required arguments' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                email,                
            },
            attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'userType', 'status','createdAt','updatedAt'],
            include: [
                { model: Balance },   
                { model: UserAddress, attributes: ['id', 'userId', 'address', 'createdAt', 'updatedAt'] }                           
            ],
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: user })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.adminGetUserDataById = (req, res) => {
    const userId = req.params.userId

    if (!userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required arguments' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,                
            },
            attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'userType', 'status','createdAt','updatedAt'],
            include: [
                { model: Balance },   
                { model: UserAddress, attributes: ['id', 'userId', 'address', 'createdAt', 'updatedAt'] }                           
            ],
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: user })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}
