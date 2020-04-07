const User = require('../models/sequelize').User
const Admin = require('../models/sequelize').Admin
const Company = require('../models/sequelize').Company
const UserLocation = require('../models/sequelize').UserLocation
const GuardAccess = require('../models/sequelize').GuardAccess
const Bitacora = require('../models/sequelize').Bitacora
const Report = require('../models/sequelize').Report
const Route = require('../models/sequelize').Route
const Checkpoint = require('../models/sequelize').Checkpoint
const sendJSONresponse = require('../utils').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize');
const moment = require('moment')

module.exports.checkPrivileges = function (req, res) {
    const userId = req.user.id

    if (!userId) {
        sendJSONresponse(res, 422, { message: 'All fields required' })
        return
    }

    User.findOne({
        where: {
            id: userId
        }
    })
        .then((user) => {
            if (!user) {
                sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not exist' })
                return
            }
            Admin.findOne({
                where: {
                    userId: user.id
                }
            })
                .then((admin) => {
                    if (!admin || admin.level == 0) {
                        sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not have enough privileges' })
                        return
                    }
                    sendJSONresponse(res, 200, { status: 'OK', payload: admin })
                    return
                })
                .catch((err) => {
                    console.log(err)
                    sendJSONresponse(res, 404, { status: 'ERROR', message: err })
                    return
                })
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: err })
            return
        })
}

module.exports.givePrivileges = (req, res) => {
    const adminId = req.user.id
    const userId = req.params.userId

    if (!adminId || !userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        const admin = await Admin.findOne({
            where: {
                userId: adminId,
                level: {
                    [Op.gte]: 1
                }
            },
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Your account does not have enough privileges' })
            return
        }

        const newAdmin = await User.findOne({
            where: {
                id: userId,
            },
            include: [
                { model: Admin }
            ],
            transaction: t
        })

        if (!newAdmin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The user you are trying to give privileges does not exist' })
            return
        }

        if (!newAdmin.admin) {
            await Admin.create({
                userId: newAdmin.id,
                level: 1
            })

            newAdmin.userType = 'admin'
            await newAdmin.save({ transaction: t })

            sendJSONresponse(res, 200, { status: 'OK', message: 'Nuevo adminsitrador creado correctamente' })
            return
        }
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ocurrió un error al intentar procesar la información' })
            return
        })
}

module.exports.getUsersByType = async (req, res) => {
    const userId = req.user.id
    const userType = req.query.userType ? req.query.userType : 'all'
    const page = req.query.page ? req.query.page : 1
    let limit = 50
    let offset = 0

    if (!userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'All fields required' })
        return
    }

    sequelize.transaction(async (t) => {
        const admin = await Admin.findOne({
            where: {
                userId
            },
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not have enough privileges' })
            return
        }

        const result = await User.findAndCountAll({ transaction: t })
        let pages = Math.ceil(result.count / limit)
        offset = limit * (page - 1)
        let users
        if (userType == 'all') {
            users = await User.findAll({
                limit,
                offset,
                transaction: t,
            })
        } else {
            users = await User.findAll({
                limit,
                offset,
                transaction: t,
                where: {
                    userType,
                }
            })
        }

        sendJSONresponse(res, 200, { status: 'OK', count: result.count, pages: pages, payload: users })
        return

    })
        .catch(err => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'OK', message: 'Ocurrió un error al intentar procesar la información' })
            return
        })
}

module.exports.getUserProfile = (req, res) => {
    const userId = req.params.userId
    const adminId = req.user.id

    if (!userId || !adminId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'All fields required' })
        return
    }

    sequelize.transaction(async (t) => {
        const admin = await Admin.findOne({
            where: {
                userId: adminId
            },
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not have enough privileges' })
            return
        }

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: [
                { model: UserLocation, limit: 1000, order: [['createdAt', 'DESC']] },
                { model: GuardAccess, limit: 10, order: [['createdAt', 'DESC']] },
                { model: Report, order: [['createdAt', 'DESC']] },
                { model: Bitacora, order: [['createdAt', 'DESC']] },
                { model: Company }

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
        .catch(err => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'OK', message: 'Ocurrió un error al intentar procesar la información' })
            return
        })
}

module.exports.getAdminData = (req, res) => {
    const userId = req.user.id

    if (!userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'All fields required' })
        return
    }

    sequelize.transaction(async (t) => {
        const admin = await Admin.findOne({
            where: {
                userId,
            },
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not have enough privileges' })
            return
        }

        const user = await User.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'username', 'identification', 'name', 'email',
                'phone', 'address', 'companyId', 'code', 'userType', 'active', 'status',
                'createdAt', 'updatedAt'],
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
            sendJSONresponse(res, 404, { status: 'OK', message: 'Ocurrió un error al intentar procesar la información' })
            return
        })
}

module.exports.getAdminStats = (req, res) => {
    const adminId = req.user.id

    if (!adminId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ingresa todos los campos requeridos' })
        return
    }    

    sequelize.transaction(async (t) => {
        const admin = await Admin.findOne({
            where: {
                userId: adminId
            },
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not have enough privileges' })
            return
        }

        const guardsPromise = User.count({ where: { userType: 'guard' }, transaction: t, raw: true })
        const adminsPromise = User.count({ where: { userType: 'admin' }, transaction: t, raw: true })
        const reportsPromise = Report.count({ transaction: t, raw: true })
        const bitacorasPromise = Bitacora.count({ transaction: t, raw: true })
        const totals = await Promise.all([guardsPromise, adminsPromise, reportsPromise, bitacorasPromise])

        const data = {
            totalGuards: totals[0],
            totalAdmins: totals[1],
            totalReports: totals[2],
            totalBitacoras: totals[3]
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: data })
        return
    })
        .catch(err => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'OK', message: 'Ocurrió un error al intentar procesar la información' })
            return
        })
}

module.exports.getDashboardData = (req, res) => {
    const adminId = req.user.id

    if (!adminId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        const admin = await Admin.findOne({
            where: {
                userId: adminId
            },
            include: [
                {model: User}
            ],
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User does not have enough privileges' })
            return
        }
        
        // Guards
        const guardsOnPatrol = await User.count({
            where: {
                userType: 'guard',
                status: 'ON_PATROL',
                companyId: admin.user.companyId,
                active: 1
            },
            transaction: t
        })
        
        const guardsOnStandBy = await User.count({
            where: {
                userType: 'guard',
                status: 'ON_STAND_BY',
                companyId: admin.user.companyId,
                active: 1
            },
            transaction: t
        })

        // Routes
        const activeRoutes = await Route.count({
            where: {
                status: 'ACTIVE',
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        const completedRoutes = await Route.count({
            where: {
                status: 'COMPLETED',
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        // Checkpoints
        const activeCheckpoints = await Checkpoint.count({
            where: {
                status: 'ACTIVE',
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        const completedCheckpoints = await Checkpoint.count({
            where: {
                status: 'COMPLETED',
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        // Access Logs
        const entryLogs = await GuardAccess.count({
            where: {
                accessType: 'ENTRY',
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        const exitLogs = await GuardAccess.count({
            where: {
                accessType: 'EXIT',
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        // Reports
        const totalReports = await Report.count({
            where: {
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        // Bitacoras
        const totalBitacoras = await Bitacora.count({
            where: {
                companyId: admin.user.companyId,
                createdAt: {
                    [Op.gte]: moment().subtract(1, "days").toDate(),
                },
            },
            transaction: t
        })

        let data = {
            guardsOnPatrol, guardsOnStandBy, activeRoutes, completedRoutes,
            activeCheckpoints, completedCheckpoints, entryLogs, exitLogs,
            totalReports, totalBitacoras
        }

        sendJSONresponse(res, 200, {status: 'OK', payload: data})
        return

    })
        .catch(err => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'OK', message: 'Ocurrió un error al intentar procesar la información' })
            return
        })
}