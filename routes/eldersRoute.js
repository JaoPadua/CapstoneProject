const express = require('express')
const {
    moveElder,
    getElder,
    getElders,
    deleteElders,
    updateElders,
} = require("../controllers/elderController")

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()



//
// require auth for all users routes
router.use(requireAuth)
//Post a new user public

router.post('/move-item/:uid', moveElder)

//Get all users
router.get('/', getElders)

//Get single user

router.get('/:uid',getElder)



//DELETE a user

router.delete('/:uid', deleteElders)


//Update a user?

router.patch('/:uid',updateElders)

module.exports = router;