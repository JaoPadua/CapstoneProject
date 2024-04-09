const express = require('express');
const multer = require('multer');
const {
    createUser,
    getUser,
    getUsers,
    deleteUsers,
    updateUsers,
    searchUsers,
    upload,
} = require("../controllers/usersController")
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

const createLogMiddleware = require('../middleware/logsMiddleware');

const logDelete = createLogMiddleware('Deleted Elder Data on ID verification')

//Post a new user public

router.post('/', upload.single('ProofOfValidID'), createUser)
    

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

router.delete('/:uid',logDelete, deleteUsers)


//Update a user?

router.patch('/:uid',updateUsers)

module.exports = router;