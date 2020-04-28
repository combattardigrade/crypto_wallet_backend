
const fetch = require('node-fetch')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const API_HOST = process.env.API_HOST
const rp = require('request-promise')

module.exports.renderApp = function (req, res) {

    try {
        res.sendFile(APP_ROOT + '/public/index.html')
    }
    catch (e) {
        console.log(e)
    }

    return
}
