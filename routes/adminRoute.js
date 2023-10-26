const express = require('express')

//controller functions

const {loginAdmin, signupAdmin,getAdmin,deleteAdmin} = require('../controllers/adminController')


//Router
const router =express.Router()


//login Route
router.post('/login', loginAdmin)

//signup Route

router.post('/signup',signupAdmin)


//get admin Router
router.get('/getAdmin',getAdmin)

//delete Admin

router.delete('/:uid', deleteAdmin)

module.exports = router