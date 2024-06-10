const express = require('express')

//controller functions

const {signupElder,loginElder,forgotPassword,resetPassword,checkConcurrentSession,logoutElder} =require('../controllers/elderPortalLoginController.js')

//const requireAuth = require('../middleware/requireAuth')
//Router
const router = express.Router()

//getElderProfile
//router.get('/elderProfile/:uid',requireAuth,getElderProfile)


//login to portal
router.post('/ElderLogin', loginElder)

//logout to portal
router.post('/logout', logoutElder)

//signup for portal

router.post('/ElderSignup',signupElder)

router.post('/forgotPassword',forgotPassword)

router.post('/reset-password/:id/:token',resetPassword)


module.exports = router

