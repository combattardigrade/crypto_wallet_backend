
const fetch = require('node-fetch')
const rp = require('request-promise')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const API_HOST = process.env.API_HOST


module.exports.checkPrivileges = function (req, res) {
    rp({
        uri: API_HOST + '/admin/checkPrivileges',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            if (response.message === 'AUTHORIZED')
                sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 401, err)
        })
}

module.exports.checkAuth = function (req, res) {
    sendJSONresponse(res, 200, { message: 'AUTHENTICATED' })
    return
}

module.exports.getCSRFToken = function (req, res) {
    sendJSONresponse(res, 200, { csrf: req.csrfToken() })
    return
}

module.exports.renderLogin = function (req, res) {
    sendJSONresponse(res, 200, { csrf: req.csrfToken() })
    return
}

module.exports.login = function (req, res) {
    const email = req.body.email
    const password = req.body.password

    if (req.recaptcha.error) {
        sendJSONresponse(res, 404, { message: 'Verifica que eres humano' })
        return
    }

    fetch(API_HOST + '/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password }),
    })
        .then(response => response.json())
        .then((response) => {
            console.log(response)
            if (response.message) {
                sendJSONresponse(res, 200, response)
                return
            }
            // set cookie
            res.cookie('token', response.token, { httpOnly: true, secure: process.env.NODE_ENV == 'production' })
            sendJSONresponse(res, 200, { token: response.token })
            return
        })

}