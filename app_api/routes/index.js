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

// auth
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// user
router.get('/user', auth, userController.getUserData)

// transactions
router.get('/txs', auth, txController.getAllTxs)
router.post('/sendInternalTx', auth, txController.sendInternalTx)

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