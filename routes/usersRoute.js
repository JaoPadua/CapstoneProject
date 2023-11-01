const express = require('express')
const {
    createUser,
    getUser,
    getUsers,
    deleteUsers,
    updateUsers,
    searchUsers,
} = require("../controllers/usersController")

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//Post a new user public

router.post('/', createUser)

//
// require auth for all users routes
router.use(requireAuth)


//Get all users
router.get('/', getUsers)

//search users

router.get('/search',searchUsers)


//Get single user

router.get('/:uid',getUser)



//DELETE a user

router.delete('/:uid', deleteUsers)


//Update a user?

router.patch('/:uid',updateUsers)

module.exports = router;