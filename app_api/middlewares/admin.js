const User = require('../models/sequelize').User
const sendJSONresponse = require('../../utils/index').sendJSONresponse

module.exports.adminAuth = function(req, res, next) {
    const adminId = req.user.id

    if(!adminId) {
        sendJSONresponse(res, 422, {status: 'ERROR', message: 'Missing authentication token'})
        return
    }

    User.findOne({
        where: {
            id: adminId,
            userType: 'admin',
            status: 'ACTIVE'
        }
    })
        .then((admin) => {
            console.log(admin)
            if(!admin) {
                sendJSONresponse(res, 422, {status: 'ERROR', message: 'Your account does not exist or you do not have enough privileges'})
                return
            }
            next()
        })
}