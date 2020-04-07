const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET,
    getToken: function(req) {
        if(req.cookies.adminToken !== undefined) {
            return req.cookies.adminToken
        } else {
            throw new Error('missing_admin_token_cookie')
        }
    }
})



const adminController = require('../controllers/admin')

// admin
router.get('/login',adminController.renderLogin)
router.post('/login',  adminController.login)
router.get('/dashboard', auth, adminController.renderDashboard)

router.get('/users/:userType/:page?', auth, adminController.renderUsers)
router.get('/user/:userId', auth, adminController.renderUserProfile)
router.get('/addGuard/', auth, adminController.renderAddGuard)
router.post('/addGuard', auth, auth, adminController.addGuard)
router.get('/addAdmin', auth, adminController.renderAddAdmin)
router.post('/addAdmin', auth, adminController.addAdmin)
router.get('/updateUser', auth, adminController.renderUpdateUser)
router.post('/updateUser', auth, adminController.updateUser)

router.get('/bitacoras', auth, adminController.renderBitacoras)
router.get('/reports', auth, adminController.renderReports)
router.get('/accesos', auth, adminController.renderAccesos)

router.get('/accessLog/:logId', auth, adminController.renderAccessLog)
router.get('/report/:reportId', auth, adminController.renderReport)
router.get('/bitacora/:bitacoraId', auth, adminController.renderBitacora)

router.get('/chat', auth, adminController.renderChat)
router.post('/chat', auth, adminController.sendChatMessage)

router.get('/company', auth, adminController.renderCompanyProfile)
router.post('/company', auth, adminController.changeCompanyProfile)

router.get('/routes/:status', auth, adminController.renderRoutes)
router.get('/createRoute', auth, adminController.renderCreateRoute)
router.get('/route/:routeId', auth, adminController.renderRoute)
router.post('/createRoute', auth, adminController.createRoute)

// view / edit checkpoint
router.get('/checkpoint/:checkpointId', auth, adminController.renderCheckpoint)
router.post('/checkpoint/:checkpointId', auth, adminController.editCheckpoint)
// Add checkpoint to route
router.get('/addCheckpoint/:routeId', auth, adminController.renderAddCheckpoint)
router.post('/addCheckpoint/:routeId', auth, adminController.addCheckpoint)
router.post('/deleteCheckpoint', auth, adminController.deleteCheckpoint)

// car routes
router.get('/carRoutes/:status', auth, adminController.renderCarRoutes)
router.get('/carRoute/:carRouteId', auth, adminController.renderCarRoute)

router.get('/getAdminData', auth, adminController.getAdminData)

router.get('/account', auth, adminController.renderAccount)

router.get('/logout', auth, adminController.logout)

module.exports = router