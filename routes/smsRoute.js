const express = require('express')
const bodyParser  = require('body-parser')
const {sendAcceptSMS, sendDenySMS} = require('../controllers/smsController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()



const createLogMiddleware = require('../middleware/logsMiddleware');

const logAccepted = createLogMiddleware('Sent a Accept SMS')
const logDenied = createLogMiddleware('Sent a Denied SMS')


// require auth for all news routes
router.use(requireAuth)

//acceptSMS Route
router.post('/accept/:uid',logAccepted,sendAcceptSMS)


//deniedSMS Route
router.post('/deny/:uid',logDenied,sendDenySMS)






module.exports = router