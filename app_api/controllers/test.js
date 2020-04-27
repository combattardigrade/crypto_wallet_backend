const sendJSONresponse = require('../utils/index.js').sendJSONresponse

module.exports.test = (req, res) => {
    console.log(req.kauth.grant.access_token.content);
    sendJSONresponse(res, 200, { status: 'OK', message: 'Hello World'})
    return
}