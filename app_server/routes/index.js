const express = require('express')
const router = express.Router()
console.log('test')
const generalController = require('../controllers/general')

router.get('/*', generalController.renderApp)

module.exports = router