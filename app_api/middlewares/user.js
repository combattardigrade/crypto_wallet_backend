const User = require('../models/sequelize').User
const sendJSONresponse = require('../../utils/index').sendJSONresponse

module.exports.userAuth = function(req, res, next) {
    const userId = req.user.id

    if(!userId) {
        sendJSONresponse(res, 422, {status: 'ERROR', message: 'Missing authentication token'})
        return
    }

    User.findOne({
        where: {
            id: userId
        }
    })
        .then((user) => {
            if(!user) {
                sendJSONresponse(res, 422, {status: 'ERROR', message: 'Error de autenticación. La cuenta no existe o se encuentra inactiva'})
                return
            }
            next()
        })
}