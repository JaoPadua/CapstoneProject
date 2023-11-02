const express = require('express')
const {
  uploadExcel,
  searchImportElders,
  getImportElders,
  getImportedElder,
  updateImportElder,
  deleteImportElder,
} = require("../controllers/importController")

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()



//
// require auth for all users routes
router.use(requireAuth)
//Post a new user public

router.post('/upload',uploadExcel)

//Get all users
router.get('/', getImportElders)


//search elder
router.get('/search', searchImportElders)


//Get single user

router.get('/:uid',getImportedElder)



//DELETE a user

router.delete('/:uid', updateImportElder)


//Update a user?

router.patch('/:uid',deleteImportElder)

module.exports = router;