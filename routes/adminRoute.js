const express = require('express')

//controller functions

const {loginAdmin, signupAdmin,getAdmin,deleteAdmin, getSingleAdmin} = require('../controllers/adminController')

const createLogMiddleware = require('../middleware/logsMiddleware');


const logDelete = createLogMiddleware('Deleted an Admin User')


//Router
const router =express.Router()


//login Route
router.post('/login', loginAdmin)

//signup Route

router.post('/signup',signupAdmin)


//get admin Router
router.get('/getAdmin',getAdmin)

//get single Admin for edit and login
router.get('/getSingleAdmin/:uid',getSingleAdmin)

//delete Admin

router.delete('/:uid', deleteAdmin)

module.exports = router