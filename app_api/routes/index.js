const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET
})

const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const txController = require('../controllers/transaction')
const txReasonController = require('../controllers/txReason')
const contactController = require('../controllers/contact')
const paymentRequestController = require('../controllers/paymentRequest')
const networkController = require('../controllers/network')

// auth
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// user
router.get('/user', auth, userController.getUserData)

// transactions
router.get('/txs', auth, txController.getAllTxs)
router.post('/sendInternalTx', auth, txController.sendInternalTx)

//  Payment Request
router.post('/paymentRequest', auth, paymentRequestController.createPaymentRequest)
router.get('/paymentRequests/:status', auth, paymentRequestController.getPaymentRequests)
router.put('/paymentRequest', auth, paymentRequestController.updatePaymentRequest)
router.delete('/paymentRequest/:requestId', auth, paymentRequestController.deletePaymentRequest)
router.get('/paymentRequest/:requestId', auth, paymentRequestController.getPaymentRequest)
router.get('/approvePaymentRequest/:requestId', auth, paymentRequestController.approvePaymentRequest)
router.get('/rejectPaymentRequest/:requestId', auth, paymentRequestController.rejectPaymentRequest)

// Network
router.post('/withdrawTokens', auth, networkController.sendTokens)
router.get('/checkDeposits', networkController.checkDeposits)

// TxReason
router.post('/txReason', auth, txReasonController.createTxReason)
router.get('/txReasons', auth, txReasonController.getTxReasons)

// Contacts
router.get('/contact/:contactId', auth, contactController.getContact)
router.post('/contact', auth, contactController.createContact)
router.get('/contacts', auth, contactController.getContacts)
router.delete('/contact/:contactId', auth, contactController.deleteContact)
router.post('/searchContact', auth, contactController.searchContact)

// rankings
router.get('/rankings/:period', auth, txController.getRankingsByPeriod)

module.exports = router