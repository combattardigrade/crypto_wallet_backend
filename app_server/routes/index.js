const express = require('express')
const router = express.Router()

const generalController = require('../controllers/general')

router.get('/*', generalController.renderAdminApp)

module.exports = router