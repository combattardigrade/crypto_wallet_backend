const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')

// middlewares
const auth = jwt({ secret: process.env.JWT_SECRET })
const userAuth = require('../middlewares/user').userAuth
const adminAuth = require('../middlewares/admin').adminAuth

// Controllers
const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const txController = require('../controllers/transaction')
const txReasonController = require('../controllers/txReason')
const contactController = require('../controllers/contact')
const paymentRequestController = require('../controllers/paymentRequest')
const networkController = require('../controllers/network')
const pushNotificationController = require('../controllers/pushNotification')

// Auth
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/keycloakLogin', authController.keycloakLogin)
router.post('/getKeycloakToken', authController.getKeycloakToken)

// User
router.get('/user', auth, userController.getUserData)
router.get('/user/:userId', auth, userController.getUserDetails)

// Admin => User
router.get('/admin/user/:email/email', [auth, adminAuth], userController.adminGetUserDataByEmail)
router.get('/admin/user/:userId/id', [auth,adminAuth], userController.adminGetUserDataById)

// Transactions
router.get('/txs', auth, txController.getAllTxs)
router.post('/sendInternalTx', auth, txController.sendInternalTx)

// Admin => Transactions
router.get('/admin/txs/:userId', [auth, adminAuth], txController.adminGetAllTxs)
router.post('/admin/sendInternalTx', [auth, adminAuth], txController.adminSendInternalTx)

// Payment Request
router.post('/paymentRequest', auth, paymentRequestController.createPaymentRequest)
router.get('/paymentRequests/:status', auth, paymentRequestController.getPaymentRequests)
router.put('/paymentRequest', auth, paymentRequestController.updatePaymentRequest)
router.delete('/paymentRequest/:requestId', auth, paymentRequestController.deletePaymentRequest)
router.get('/paymentRequest/:requestId', auth, paymentRequestController.getPaymentRequest)
router.get('/approvePaymentRequest/:requestId', auth, paymentRequestController.approvePaymentRequest)
router.get('/rejectPaymentRequest/:requestId', auth, paymentRequestController.rejectPaymentRequest)

// Admin => Payment Request
router.post('/admin/paymentRequest', [auth, adminAuth], paymentRequestController.adminCreatePaymentRequest)
router.get('/admin/paymentRequests/:userId/:status', [auth, adminAuth], paymentRequestController.adminGetPaymentRequests)
router.put('/admin/paymentRequest', [auth, adminAuth], paymentRequestController.adminUpdatePaymentRequest)
router.delete('/admin/paymentRequest/:userId/:requestId', [auth, adminAuth], paymentRequestController.adminDeletePaymentRequest)
router.get('/admin/paymentRequest/:userId/:requestId', [auth, adminAuth], paymentRequestController.adminGetPaymentRequest)
router.get('/admin/approvePaymentRequest/:userId/:requestId', [auth, adminAuth], paymentRequestController.adminApprovePaymentRequest)
router.get('/admin/rejectPaymentRequest/:userId/:requestId', [auth, adminAuth], paymentRequestController.adminRejectPaymentRequest)

// Network
router.post('/withdrawTokens', auth, networkController.sendTokens)
router.get('/checkDeposits', networkController.checkDeposits)

// Network => Admin
router.post('/admin/withdrawTokens', [auth, adminAuth], networkController.adminSendTokens)

// TxReason
router.post('/txReason', [auth, adminAuth], txReasonController.createTxReason)
router.get('/txReasons', auth, txReasonController.getTxReasons)

// Contacts
router.get('/contact/:contactId', auth, contactController.getContact)
router.post('/contact', auth, contactController.createContact)
router.get('/contacts', auth, contactController.getContacts)
router.delete('/contact/:contactId', auth, contactController.deleteContact)
router.post('/searchContact', auth, contactController.searchContact)

// Admin => Contacts
router.get('/admin/contact/:userId/:contactId', [auth, adminAuth], contactController.adminGetContact)
router.post('/admin/contact', [auth, adminAuth], contactController.adminAddContact)
router.get('/admin/contacts/:userId', [auth, adminAuth], contactController.adminGetContacts)
router.delete('/admin/contact', [auth, adminAuth], contactController.adminDeleteContact)

// Rankings
router.get('/rankings/:period', auth, txController.getRankingsByPeriod)

// Admin => Rankings
router.get('/admin/rankings/:period', [auth, adminAuth], txController.adminGetRankingsByPeriod)

// Push Notifications
router.post('/push/registrationId', auth, pushNotificationController.saveRegistrationId)
router.post('/push/test', auth, pushNotificationController.testNotification)

module.exports = router