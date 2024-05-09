const express = require('express')
const bodyParser  = require('body-parser')
const {
    //sendAcceptSMS, 
    //sendDenySMS,
    sendSmSText,
    sendBulkSMS,} = require('../controllers/smsController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()



const createLogMiddleware = require('../middleware/logsMiddleware');

const logSingleSMS = createLogMiddleware('Sent a SMS')
const logBulkSMS = createLogMiddleware('Sent a Bulk SMS')


// require auth for all news routes
router.use(requireAuth)

//acceptSMS Route
//router.post('/accept/:uid',logAccepted,sendAcceptSMS)

router.post('/sendSmS/:uid',logSingleSMS, sendSmSText)


router.post('/sendToMany/:uids', logBulkSMS, sendBulkSMS)


//deniedSMS Route
//router.post('/deny/:uid',logDenied,sendDenySMS)






module.exports = router