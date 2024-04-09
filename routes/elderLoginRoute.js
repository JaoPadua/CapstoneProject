const express = require('express')

//controller functions

const {signupElder,loginElder} =require('../controllers/elderPortalLoginController.js')


//Router
const router =express.Router()

//login to portal
router.post('/ElderLogin', loginElder)


//signup for portal

router.post('/ElderSignup',signupElder)


module.exports = router

