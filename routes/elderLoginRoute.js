const express = require('express')

//controller functions

const {signupElder,loginElder,forgotPassword,resetPassword,getElderProfile} =require('../controllers/elderPortalLoginController.js')

//const requireAuth = require('../middleware/requireAuth')
//Router
const router = express.Router()

//getElderProfile
//router.get('/elderProfile/:uid',requireAuth,getElderProfile)


//login to portal
router.post('/ElderLogin', loginElder)


//signup for portal

router.post('/ElderSignup',signupElder)

router.post('/forgotPassword',forgotPassword)

router.post('/reset-password/:id/:token',resetPassword)


module.exports = router

