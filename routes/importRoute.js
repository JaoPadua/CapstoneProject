const express = require('express')
const {
  uploadExcel,
  getAllImport,
  getImportElders,
  getImportedElder,
  updateImportElder,
  deleteImportElder,
} = require("../controllers/importController")

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


const createLogMiddleware = require('../middleware/logsMiddleware');

const logDelete = createLogMiddleware('Deleted Elder Data at Import Table')
const logUpdate = createLogMiddleware('Updated Elder Data at Import Table')
const logUpload = createLogMiddleware('Imported an Excel Data')
//
// require auth for all users routes
router.use(requireAuth)
//Post a new user public

router.post('/upload',logUpload,uploadExcel)

//Get paginated users
router.get('/', getImportElders)


//search elder
router.get('/getAll', getAllImport)


//Get single user

router.get('/:uid',getImportedElder)



//DELETE a user

router.delete('/:uid', logDelete,deleteImportElder)


//Update a user?

router.patch('/updateImport/:uid',logUpdate,updateImportElder)

module.exports = router;