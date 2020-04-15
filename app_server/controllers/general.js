
const fetch = require('node-fetch')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const API_HOST = process.env.API_HOST
const rp = require('request-promise')

module.exports.renderAdminApp = function (req, res) {

    try {
        res.sendFile(APP_ROOT + '/public/admin.html')
    }
    catch (e) {
        console.log(e)
    }

    return
}
