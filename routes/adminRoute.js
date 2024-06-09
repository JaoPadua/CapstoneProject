const express = require('express')

//controller functions

const {loginAdmin, signupAdmin,getAdmin,deleteAdmin, getSingleAdmin, forgotAdminPassword,resetAdminPassword,checkConcurrentSessionAdmin,logoutAdmin} = require('../controllers/adminController')

const createLogMiddleware = require('../middleware/logsMiddleware');


const logDelete = createLogMiddleware('Deleted an Admin User')


//Router
const router =express.Router()


//login Route
router.post('/login', loginAdmin,checkConcurrentSessionAdmin)


//signup Route

router.post('/signup',signupAdmin)
//logout route
router.post('/logoutAdmin', logoutAdmin)



//get admin Router
router.get('/getAdmin',getAdmin)

//get single Admin for edit and login
router.get('/getSingleAdmin/:uid',getSingleAdmin)

//delete Admin

router.delete('/:uid', deleteAdmin)

router.post('/forgotAdminPass',forgotAdminPassword)

router.post('/reset-AdminPass/:id/:token',resetAdminPassword)


module.exports = router