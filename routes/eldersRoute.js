const express = require('express')
const {
    moveElder,
    getElder,
    getElders,
    deleteElders,
    updateElders,
    searchElders,
    exportElder,
} = require("../controllers/elderController")

const createLogMiddleware = require('../middleware/logsMiddleware');

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


const logDelete = createLogMiddleware('Deleted Elder Data on Verified Tables')
const logApproved = createLogMiddleware('Approved an Elder')
//
// require auth for all users routes
router.use(requireAuth)
//Post a user to Verified

router.post('/move-item/:uid', logApproved,moveElder)

//Get all users
router.get('/', getElders)


//search elder
router.get('/search', searchElders)


//Get single user

router.get('/:uid',getElder)


//export Elders Via Barangay
router.get('/export/:barangay',exportElder)


//DELETE a user

router.delete('/:uid', logDelete,deleteElders)


//Update a user?

router.put('/update/:uid',updateElders)

module.exports = router;