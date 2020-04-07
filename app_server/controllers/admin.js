const rp = require('request-promise');
const request = require('request')
const crypto = require('crypto')
const moment = require('moment')
const API_HOST = process.env.API_HOST
const SERVER_HOST = process.env.SERVER_HOST
const sendJSONresponse = require('../utils/index.js').sendJSONresponse


module.exports.renderLogin = function (req, res) {
    res.render('admin/login', {
        host: process.env.SERVER_HOST,
        title: 'Iniciar sesion',
        csrf: req.csrfToken(),
        serverMsg: ''
    })
}

module.exports.login = async function (req, res) {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        res.render('admin/login', {
            host: SERVER_HOST,
            title: 'Iniciar sesion',
            csrf: req.csrfToken(),
            serverMsg: 'Ingresa todos los campos requeridos',
        })
        return
    }

    const options = {
        url: API_HOST + 'login',
        method: 'POST',
        json: { username: username, password: password }
    }


    request(options, function (err, response, body) {

        const token = body.token
        if (token) {
            request({
                url: API_HOST + 'admin/checkPrivileges/',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }, function (errAdmin, responseAdmin, bodyAdmin) {

                var bodyAdmin = JSON.parse(bodyAdmin)
                if ('payload' in bodyAdmin) {
                    if (bodyAdmin.payload.level > 0) {
                        // to do: set cookie exp time and secure for production
                        if (process.env.NODE_ENV == 'production') {
                            // set cookie
                            res.cookie('adminToken', token, { httpOnly: true, secure: true })
                        } else {
                            // set cookie
                            res.cookie('adminToken', token, { httpOnly: true })
                        }
                        // redirect to dashboard
                        res.writeHead(302, {
                            'Location': 'dashboard'
                        })
                        res.end()
                    }
                } else {

                    res.render('admin/login', {
                        host: SERVER_HOST,
                        title: 'Iniciar sesion',
                        csrf: req.csrfToken(),
                        serverMsg: bodyAdmin.message,

                    })
                }
            })
        } else {

            res.render('admin/login', {
                host: SERVER_HOST,
                title: 'Iniciar sesion',
                csrf: req.csrfToken(),
                serverMsg: body.message,

            })
        }
    })

}

module.exports.renderDashboard = async function (req, res) {
    
    const getRoutesResponse = rp({
        uri: API_HOST + `getCompanyRoutesByStatus/ACTIVE`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const getCompanyGuardsResponse = rp({
        uri: API_HOST + `getAllActiveGuards`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const getReportsResponse = rp({
        uri: API_HOST + `getCompany24hReports`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const data = await Promise.all([getRoutesResponse, getCompanyGuardsResponse, getReportsResponse])
    
    res.render('admin/dashboard', {
        host: process.env.SERVER_HOST,
        title: 'Dashboard',
        csrf: req.csrfToken(),
        token: req.cookies.adminToken,
        routes: 'payload' in data[0] ? data[0].payload : '',
        guards: 'payload' in data[1] ? data[1].payload : '',
        reports: 'payload' in data[2] ? data[2].payload : '',
    })
}

module.exports.renderUsers = async function (req, res) {
    let userType = req.params.userType ? req.params.userType : 'all'
    const page = req.params.page ? req.params.page : 1

    if (userType == 'admins') userType = 'admin'

    const options = {
        uri: API_HOST + `admin/getUsersByType?userType=${userType}&page=${page}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    }

    const response = await rp(options)

    res.render('admin/users', {
        host: process.env.SERVER_HOST,
        title: `Usuarios: ${userType}`,
        users: 'payload' in response ? response.payload : [],
        userType,
        page,
    })
}

module.exports.renderUserProfile = async (req, res) => {
    const userId = req.params.userId

    const options = {
        uri: API_HOST + `admin/userProfile/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    }

    const response = await rp(options)

    res.render('admin/userProfile', {
        host: process.env.SERVER_HOST,
        title: `Perfil de Usuario`,
        user: 'payload' in response ? response.payload : '',
        userId,
        token: req.cookies.adminToken,
        
    })
}

module.exports.renderAddGuard = async (req, res) => {
    res.render('admin/addGuard', {
        host: process.env.SERVER_HOST,
        title: `Añadir Guardia de Seguridad`,
        csrf: req.csrfToken(),
        serverMsg: '',

    })
}

module.exports.addGuard = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const rpassword = req.body.rpassword
    const identification = req.body.identification
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const address = req.body.address
    const companyCode = req.body.companyCode
    const imei = req.body.imei

    if (!username || !password || !rpassword || !identification ||
        !name || !phone || !email || !address || !companyCode || !imei
    ) {
        res.render('admin/addGuard', {
            host: process.env.SERVER_HOST,
            title: `Añadir Guardia de Seguridad`,
            csrf: req.csrfToken(),
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false,
            username, password, identification,
            name, phone, email, address, companyCode, imei
        })
        return
    }

    if (password != rpassword) {
        res.render('admin/addGuard', {
            host: process.env.SERVER_HOST,
            title: `Añadir Guardia de Seguridad`,
            csrf: req.csrfToken(),
            serverMsg: 'Las contraseñas ingresadas no coinciden',
            valid: false,
            username, password, identification,
            name, phone, email, address, companyCode, imei
        })
        return
    }

    const options = {
        uri: API_HOST + `signup`,
        method: 'POST',
        body: {
            username, password, identification,
            name, phone, email, address, companyCode, imei
        },
        json: true
    }

    rp(options)
        .then((response) => {

            if (response && 'status' in response && response.status == 'OK') {
                res.render('admin/addGuard', {
                    host: process.env.SERVER_HOST,
                    title: `Añadir Guardia de Seguridad`,
                    csrf: req.csrfToken(),
                    serverMsg: 'El guardia de seguridad fue añadido correctamente',
                    valid: true,
                    username: '', password: '', identification: '',
                    name: '', phone: '', email: '', address: '', companyCode: '', imei
                })
                return
            } else {

                res.render('admin/addGuard', {
                    host: process.env.SERVER_HOST,
                    title: `Añadir Guardia de Seguridad`,
                    csrf: req.csrfToken(),
                    serverMsg: 'message' in response ? response.message : 'Ocurrió un error al intentar realizar la acción',
                    valid: false,
                    username, password, identification,
                    name, phone, email, address, companyCode, imei
                })
                return
            }
        })
        .catch(err => {
            res.render('admin/addGuard', {
                host: process.env.SERVER_HOST,
                title: `Añadir Guardia de Seguridad`,
                csrf: req.csrfToken(),
                serverMsg: 'error' in err ? err.error.message : 'Ocurrió un error al intentar realizar la acción',
                valid: false,
                username, password, identification,
                name, phone, email, address, companyCode, imei
            })
            return
        })
}

module.exports.renderAddAdmin = async (req, res) => {
    res.render('admin/addAdmin', {
        host: process.env.SERVER_HOST,
        title: `Añadir Administrador`,
        csrf: req.csrfToken(),
        serverMsg: '',

    })
}

module.exports.addAdmin = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const rpassword = req.body.rpassword
    const identification = req.body.identification
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const address = req.body.address
    const companyCode = req.body.companyCode
    const imei = req.body.imei

    if (!username || !password || !rpassword || !identification ||
        !name || !phone || !email || !address || !companyCode || !imei
    ) {
        res.render('admin/addGuard', {
            host: process.env.SERVER_HOST,
            title: `Añadir Guardia de Seguridad`,
            csrf: req.csrfToken(),
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false,
            username, password, identification,
            name, phone, email, address, companyCode, imei
        })
        return
    }

    if (password != rpassword) {
        res.render('admin/addGuard', {
            host: process.env.SERVER_HOST,
            title: `Añadir Guardia de Seguridad`,
            csrf: req.csrfToken(),
            serverMsg: 'Las contraseñas ingresadas no coinciden',
            valid: false,
            username, password, identification,
            name, phone, email, address, companyCode, imei
        })
        return
    }

    const options = {
        uri: API_HOST + `signup`,
        method: 'POST',
        body: {
            username, password, identification,
            name, phone, email, address, companyCode, imei
        },
        json: true
    }

    rp(options)
        .then((response) => {

            if (response && 'status' in response && response.status == 'OK') {

                // Give admin priviledges
                rp({
                    uri: API_HOST + `admin/givePrivileges/` + response.userId,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + req.cookies.adminToken
                    },
                    json: true
                })
                    .then((response2) => {
                        if (response2 && response2.status == 'OK') {
                            res.render('admin/addGuard', {
                                host: process.env.SERVER_HOST,
                                title: `Añadir Guardia de Seguridad`,
                                csrf: req.csrfToken(),
                                serverMsg: 'El administrador fue añadido correctamente',
                                valid: true,
                                username: '', password: '', identification: '',
                                name: '', phone: '', email: '', address: '', companyCode: '', imei
                            })
                        }
                    })
            } else {

                res.render('admin/addGuard', {
                    host: process.env.SERVER_HOST,
                    title: `Añadir Guardia de Seguridad`,
                    csrf: req.csrfToken(),
                    serverMsg: 'message' in response ? response.message : 'Ocurrió un error al intentar realizar la acción',
                    valid: false,
                    username, password, identification,
                    name, phone, email, address, companyCode, imei
                })
                return
            }
        })
        .catch(err => {
            res.render('admin/addGuard', {
                host: process.env.SERVER_HOST,
                title: `Añadir Guardia de Seguridad`,
                csrf: req.csrfToken(),
                serverMsg: 'error' in err ? err.error.message : 'Ocurrió un error al intentar realizar la acción',
                valid: false,
                username, password, identification,
                name, phone, email, address, companyCode, imei
            })
            return
        })
}

module.exports.renderBitacoras = async (req, res) => {

    const options = {
        uri: API_HOST + `bitacorasByCompany`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    }

    const response = await rp(options)

    res.render('admin/bitacoras', {
        host: process.env.SERVER_HOST,
        title: `Historial de Bitácoras`,
        bitacoras: 'payload' in response ? response.payload : []
    })
}

module.exports.renderReports = async (req, res) => {

    const options = {
        uri: API_HOST + `getCompanyReports`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    }

    const response = await rp(options)

    res.render('admin/reports', {
        host: process.env.SERVER_HOST,
        title: `Historial de Reportes`,
        reports: 'payload' in response ? response.payload : []
    })
}

module.exports.renderAccesos = async (req, res) => {

    const options = {
        uri: API_HOST + `getAccessLogsByCompany`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    }

    const response = await rp(options)

    res.render('admin/accessLogs', {
        host: process.env.SERVER_HOST,
        title: `Historial de Accesos`,
        accessLogs: 'payload' in response ? response.payload : []
    })
}

module.exports.renderChat = async (req, res) => {

    const adminDataResponse = await rp({
        uri: API_HOST + `admin/getData`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const chatMessagesResponse = await rp({
        uri: API_HOST + `chat/getMessages/1`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const chatMembersResponse = await rp({
        uri: API_HOST + `companyMembers/${adminDataResponse.payload.companyId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })


    // Get user
    res.render('admin/chat', {
        host: process.env.SERVER_HOST,
        sockets_host: process.env.SOCKETS_HOST,
        title: `Chat`,
        adminData: adminDataResponse.payload,
        chatMessages: chatMessagesResponse.payload,
        chatMembers: chatMembersResponse.payload.users,
        csrf: req.csrfToken(),
    })
}

module.exports.sendChatMessage = async (req, res) => {
    const messageText = req.body.messageText

    if (!messageText) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Ingresa todos los campos requeridos' })
        return
    }

    const sendMsgResponse = await rp({
        uri: API_HOST + `chat/sendMessage`,
        method: 'POST',
        body: {
            messageText,
        },
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (sendMsgResponse && sendMsgResponse.status == 'OK') {
        sendJSONresponse(res, 200, { status: 'OK', payload: sendMsgResponse.payload, message: 'Mensaje enviado correctamente' })
        return
    }
}

module.exports.renderCompanyProfile = async (req, res) => {

    const adminDataResponse = await rp({
        uri: API_HOST + `admin/getData`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const companyDataResponse = await rp({
        uri: API_HOST + `company/${adminDataResponse.payload.companyId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const statsResponse = await rp({
        uri: API_HOST + `admin/stats`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    res.render('admin/companyProfile', {
        host: process.env.SERVER_HOST,
        title: `Empresa`,
        company: 'payload' in companyDataResponse ? companyDataResponse.payload : '',
        stats: 'payload' in statsResponse ? statsResponse.payload : '',
        csrf: req.csrfToken(),
        serverMsg: '',
        valid: ''
    })
}

module.exports.changeCompanyProfile = async (req, res) => {
    const fieldToChange = req.body.fieldToChange
    const newValue = req.body.newValue

    if (!fieldToChange || !newValue) {
        const adminDataResponse = await rp({
            uri: API_HOST + `admin/getData`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + req.cookies.adminToken
            },
            json: true
        })

        const companyDataResponse = await rp({
            uri: API_HOST + `company/${adminDataResponse.payload.companyId}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + req.cookies.adminToken
            },
            json: true
        })

        const statsResponse = await rp({
            uri: API_HOST + `admin/stats`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + req.cookies.adminToken
            },
            json: true
        })

        res.render('admin/companyProfile', {
            host: process.env.SERVER_HOST,
            title: `Empresa`,
            company: 'payload' in companyDataResponse ? companyDataResponse.payload : '',
            stats: 'payload' in statsResponse ? statsResponse.payload : '',
            csrf: req.csrfToken(),
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false,
        })
        return
    }

    const changeProfileResponse = await rp({
        uri: API_HOST + `company`,
        method: 'PUT',
        body: {
            fieldToChange,
            newValue
        },
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    const adminDataResponse = await rp({
        uri: API_HOST + `admin/getData`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const companyDataResponse = await rp({
        uri: API_HOST + `company/${adminDataResponse.payload.companyId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const statsResponse = await rp({
        uri: API_HOST + `admin/stats`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (changeProfileResponse.status == 'OK') {
        res.render('admin/companyProfile', {
            host: process.env.SERVER_HOST,
            title: `Empresa`,
            company: 'payload' in companyDataResponse ? companyDataResponse.payload : '',
            stats: 'payload' in statsResponse ? statsResponse.payload : '',
            csrf: req.csrfToken(),
            serverMsg: 'Datos actualizados correctamente',
            valid: true,
        })
    } else {
        res.render('admin/companyProfile', {
            host: process.env.SERVER_HOST,
            title: `Empresa`,
            company: 'payload' in companyDataResponse ? companyDataResponse.payload : '',
            stats: 'payload' in statsResponse ? statsResponse.payload : '',
            csrf: req.csrfToken(),
            serverMsg: 'message' in changeProfileResponse ? changeProfileResponse.message : 'Ocurrió un error al intentar realizar la acción',
            valid: false,
        })
    }
}

module.exports.renderUpdateUser = (req, res) => {
    res.render('admin/updateUser', {
        host: process.env.SERVER_HOST,
        title: `Modificar Usuario`,
        csrf: req.csrfToken(),
    })
}

module.exports.updateUser = async (req, res) => {
    const userId = req.body.userId
    const fieldToChange = req.body.fieldToChange
    const newValue = req.body.newValue

    if (!userId || !fieldToChange || !newValue) {
        res.render('admin/updateUser', {
            host: process.env.SERVER_HOST,
            title: `Modificar Usuario`,
            csrf: req.csrfToken(),
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false
        })
        return
    }

    const changeProfileResponse = await rp({
        uri: API_HOST + `updateUser`,
        method: 'PUT',
        body: {
            userId,
            fieldToChange,
            newValue
        },
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (changeProfileResponse.status == 'OK') {
        res.render('admin/updateUser', {
            host: process.env.SERVER_HOST,
            title: `Modificar Usuario`,
            csrf: req.csrfToken(),
            serverMsg: 'Datos actualizados correctamente',
            valid: true,
        })
    } else {
        res.render('admin/updateUser', {
            host: process.env.SERVER_HOST,
            title: `Modificar Usuario`,
            csrf: req.csrfToken(),
            serverMsg: 'message' in changeProfileResponse ? changeProfileResponse.message : 'Ocurrió un error al intentar realizar la acción',
            valid: false,
        })
    }
}

module.exports.renderRoutes = async (req, res) => {
    const status = req.params.status ? req.params.status : 'ACTIVE'

    const getRoutesResponse = await rp({
        uri: API_HOST + `getCompanyRoutesByStatus/${status}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    let routes
    if (getRoutesResponse.status == 'OK') {
        routes = getRoutesResponse.payload
        for (let i = 0; i < routes.length; i++) {
            let totalActive = 0
            let totalCompleted = 0
            for (let j = 0; j < routes[i].checkpoints.length; j++) {
                if (routes[i].checkpoints[j].status == 'ACTIVE') totalActive++
                if (routes[i].checkpoints[j].status == 'COMPLETED') totalCompleted++
            }
            routes[i].totalActive = totalActive
            routes[i].totalCompleted = totalCompleted
            routes[i].totalCheckpoints = totalActive + totalCompleted
        }
    }

    res.render('admin/routes', {
        host: process.env.SERVER_HOST,
        title: `Rutas: ${status}`,
        routes: routes,
        token: req.cookies.adminToken,
        status: status.toUpperCase(),
    })
}

module.exports.renderRoute = async (req, res) => {
    const routeId = req.params.routeId

    const getRouteResponse = await rp({
        uri: API_HOST + `route/${routeId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })


    res.render('admin/route', {
        host: process.env.SERVER_HOST,
        title: `Ruta ${routeId}`,
        route: 'payload' in getRouteResponse ? getRouteResponse.payload : '',
        token: req.cookies.adminToken,

    })
}

module.exports.renderCreateRoute = async (req, res) => {
    const getCompanyGuards = await rp({
        uri: API_HOST + `getAllActiveGuards`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    res.render('admin/createRoute', {
        host: process.env.SERVER_HOST,
        title: `Crear Ruta`,
        guards: 'payload' in getCompanyGuards ? getCompanyGuards.payload : '',
        csrf: req.csrfToken(),
        serverMsg: '',
        valid: ''
    })
}

module.exports.createRoute = async (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const userId = req.body.userId

    const getCompanyGuards = await rp({
        uri: API_HOST + `getAllActiveGuards`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (!name || !description || !userId) {
        res.render('admin/createRoute', {
            host: process.env.SERVER_HOST,
            title: `Crear Ruta`,
            guards: 'payload' in getCompanyGuards ? getCompanyGuards.payload : '',
            csrf: req.csrfToken(),
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false
        })
        return
    }

    const createRouteResponse = await rp({
        uri: API_HOST + `route`,
        method: 'POST',
        body: {
            userId,
            name,
            description,
        },
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if(createRouteResponse.status == 'OK') {
        // redirect to new route
        res.writeHead(302, {
            'Location': 'route/' + createRouteResponse.payload.id
        })
        res.end()
        return
    } else {
        res.render('admin/createRoute', {
            host: process.env.SERVER_HOST,
            title: `Crear Ruta`,
            guards: 'payload' in getCompanyGuards ? getCompanyGuards.payload : '',
            csrf: req.csrfToken(),
            serverMsg: 'message' in createRouteResponse ? createRouteResponse.message : 'Ocurrió un error al intentar realizar la acción',
            valid: false
        })
    }
}

module.exports.renderCheckpoint = async (req, res) => {
    const checkpointId = req.params.checkpointId
    const getCheckpointResponse = await rp({
        uri: API_HOST + `checkpoint/${checkpointId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    res.render('admin/checkpoint', {
        host: process.env.SERVER_HOST,
        title: `Punto de Control - ${checkpointId}`,
        csrf: req.csrfToken(),
        token: req.cookies.adminToken,
        checkpoint: 'payload' in getCheckpointResponse ? getCheckpointResponse.payload : '',
        serverMsg: '',
        valid: '',

    })
}

module.exports.editCheckpoint = async (req, res) => {
    const checkpointId = req.params.checkpointId
    const fieldToChange = req.body.fieldToChange
    const newValue = req.body.newValue

    const getCheckpointResponse = await rp({
        uri: API_HOST + `checkpoint/${checkpointId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (!checkpointId || !fieldToChange || !newValue) {
        res.render('admin/checkpoint', {
            host: process.env.SERVER_HOST,
            title: `Punto de Control - ${checkpointId}`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            checkpoint: 'payload' in getCheckpointResponse ? getCheckpointResponse.payload : '',
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false,
        })
        return
    }

    if (fieldToChange == 'method' && !(newValue == 'QR_CODE' || newValue == 'NFC')) {
        res.render('admin/checkpoint', {
            host: process.env.SERVER_HOST,
            title: `Punto de Control - ${checkpointId}`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            checkpoint: 'payload' in getCheckpointResponse ? getCheckpointResponse.payload : '',
            serverMsg: 'Ingresa un método válido como QR_CODE o NFC',
            valid: false,
        })
        return
    }

    const updateCheckpointResponse = await rp({
        uri: API_HOST + `checkpoint`,
        method: 'PUT',
        body: {
            checkpointId,
            fieldToChange,
            newValue
        },
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (updateCheckpointResponse.status == 'OK') {
        console.log('test')
        res.render('admin/checkpoint', {
            host: process.env.SERVER_HOST,
            title: `Punto de Control - ${checkpointId}`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            checkpoint: 'payload' in updateCheckpointResponse ? updateCheckpointResponse.payload : '',
            serverMsg: 'Punto de control actualizado correctamente',
            valid: true,
        })
        return
    } else {
        res.render('admin/checkpoint', {
            host: process.env.SERVER_HOST,
            title: `Punto de Control - ${checkpointId}`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            checkpoint: 'payload' in updateCheckpointResponse ? updateCheckpointResponse.payload : getCheckpointResponse.payload,
            serverMsg: 'message' in updateCheckpointResponse ? updateCheckpointResponse.message : getCheckpointResponse.payload,
            valid: false,
        })
        return
    }
}

module.exports.renderAddCheckpoint = async (req, res) => {
    const routeId = req.params.routeId
    const getRouteResponse = await rp({
        uri: API_HOST + `route/${routeId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    res.render('admin/addCheckpoint', {
        host: process.env.SERVER_HOST,
        title: `Añadir Punto de Control`,
        csrf: req.csrfToken(),
        token: req.cookies.adminToken,
        route: 'payload' in getRouteResponse ? getRouteResponse.payload : '',
        serverMsg: '',
        valid: '',
        code: crypto.randomBytes(16).toString('hex'),
    })
}

module.exports.addCheckpoint = async (req, res) => {
    const routeId = req.params.routeId
    const name = req.body.name
    const description = req.body.description
    const method = req.body.method
    const code = req.body.code ? req.body.code : crypto.randomBytes(16).toString('hex')
    const lat = req.body.lat
    const lng = req.body.lng

    const getRouteResponse = await rp({
        uri: API_HOST + `route/${routeId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (!routeId || !name || !description || !method || !lat || !lng) {

        res.render('admin/addCheckpoint', {
            host: process.env.SERVER_HOST,
            title: `Añadir Punto de Control`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            route: 'payload' in getRouteResponse ? getRouteResponse.payload : '',
            serverMsg: 'Ingresa todos los campos requeridos',
            valid: false,
            code,
        })
        return
    }

    const addCheckpointResponse = await rp({
        uri: API_HOST + `checkpoint`,
        method: 'POST',
        body: {
            routeId,
            name,
            description,
            lat,
            lng,
            method,
        },
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (addCheckpointResponse.status == 'OK') {
        res.render('admin/addCheckpoint', {
            host: process.env.SERVER_HOST,
            title: `Añadir Punto de Control`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            route: 'payload' in getRouteResponse ? getRouteResponse.payload : '',
            serverMsg: 'Punto de control agregado correctamente',
            valid: true,
            code,
        })
        return
    } else {
        res.render('admin/addCheckpoint', {
            host: process.env.SERVER_HOST,
            title: `Añadir Punto de Control`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            route: 'payload' in getRouteResponse ? getRouteResponse.payload : '',
            serverMsg: 'message' in addCheckpointResponse ? addCheckpointResponse.message : 'Ocurrió un error al intentar agregar el punto de control',
            valid: false,
            code,
        })
        return
    }
}

module.exports.deleteCheckpoint = async (req, res) => {
    const checkpointId = req.body.checkpointId

    const getCheckpointResponse = await rp({
        uri: API_HOST + `checkpoint/${checkpointId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    const deleteCheckpointResponse = await rp({
        uri: API_HOST + `checkpoint/${checkpointId}`,
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    if (deleteCheckpointResponse.status == 'OK') {
        // redirect to dashboard
        res.writeHead(302, {
            'Location': 'route/' + getCheckpointResponse.payload.routeId
        })
        res.end()
        return
    } else {
        res.render('admin/checkpoint', {
            host: process.env.SERVER_HOST,
            title: `Punto de Control - ${checkpointId}`,
            csrf: req.csrfToken(),
            token: req.cookies.adminToken,
            checkpoint: 'payload' in getCheckpointResponse ? getCheckpointResponse.payload : '',
            serverMsg: 'message' in deleteCheckpointResponse ? deleteCheckpointResponse.message : 'Ocurrió un error al intentar eliminar el punto de control',
            valid: false,

        })
    }
}

module.exports.getAdminData = async (req, res) => {
    const adminDataResponse = await rp({
        uri: API_HOST + `admin/getData`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    sendJSONresponse(res, 200, {status: 'OK', payload: adminDataResponse.payload})
    return
}

module.exports.logout = function(req,res) {
    res.clearCookie('adminToken')
    res.writeHead(302, {
        'Location': 'login'
    })
    res.end()
}

module.exports.renderAccount = async (req, res) => {
   
    const adminDataResponse = await rp({
        uri: API_HOST + `admin/getData`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    res.render('admin/account', {
        host: process.env.SERVER_HOST,
        title: `Cuenta`,        
        account: 'payload' in adminDataResponse ? adminDataResponse.payload : '',
    })
}

module.exports.renderAccessLog = async (req, res) => {
    const logId = req.params.logId

    const accessLog = await rp({
        uri: API_HOST + `getAccessLog/${logId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })

    res.render('admin/accessLog', {
        host: process.env.SERVER_HOST,
        title: `Cuenta`,        
        accessLog: 'payload' in accessLog ? accessLog.payload : '',
    })
}

module.exports.renderReport = async (req, res) => {
    const reportId = req.params.reportId

    const report = await rp({
        uri: API_HOST + `report/${reportId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    
    res.render('admin/report', {
        host: process.env.SERVER_HOST,
        title: `Cuenta`,        
        report: 'payload' in report ? report.payload : '',
    })
}

module.exports.renderBitacora = async (req, res) => {
    const bitacoraId = req.params.bitacoraId

    const bitacora = await rp({
        uri: API_HOST + `bitacora/${bitacoraId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    
    res.render('admin/bitacora', {
        host: process.env.SERVER_HOST,
        title: `Cuenta`,        
        bitacora: 'payload' in bitacora ? bitacora.payload : '',
    })
}


module.exports.renderCarRoutes = async (req, res) => {
   const status = req.params.status ? req.params.status : 'ALL'

    const carRoutes = await rp({
        uri: API_HOST + `getCarRoutesByStatus/${status}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    
    res.render('admin/carRoutes', {
        host: process.env.SERVER_HOST,
        title: `Recorridos de Vehículos`,
        status,        
        carRoutes: 'payload' in carRoutes ? carRoutes.payload : '',
    })
}

module.exports.renderCarRoute = async (req, res) => {
    const carRouteId = req.params.carRouteId

    const carRoute = await rp({
        uri: API_HOST + `getCarRouteDetails/${carRouteId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + req.cookies.adminToken
        },
        json: true
    })
    
    res.render('admin/carRoute', {
        host: process.env.SERVER_HOST,
        title: `Ruta de Vehículo`,         
        token: req.cookies.adminToken,      
        carRoute: 'payload' in carRoute ? carRoute.payload : '',
    })
}