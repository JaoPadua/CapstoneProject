const express = require('express')

//controller functions
const {getAllLogs,deleteLogs} = require('../controllers/logsController')

//Router
const router =express.Router()


router.get('/Logs',getAllLogs)

router.delete('/deleteLogs/:uid',deleteLogs)



module.exports = router