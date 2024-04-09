const express = require('express')

//controller functions
const {getAllLogs} = require('../controllers/logsController')

//Router
const router =express.Router()


router.get('/Logs',getAllLogs)

router.post('/deleteLogs')



module.exports = router