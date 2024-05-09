const express = require('express')
const multer = require('multer');
const {
    createDocument,
    getDocument,
    getDocuments,
    deleteDocuments,
    updateDocuments,
    getPaginatedDocuments,
} = require("../controllers/documentsController")

const createLogMiddleware = require('../middleware/logsMiddleware');


const logDelete = createLogMiddleware('Deleted a Document on document table')
const logUpdate = createLogMiddleware('Updated a Document on document table')
const logCreate = createLogMiddleware('Created a Document on document table')


const router = express.Router()


const storage = multer.memoryStorage(); 
  const upload = multer({ storage: storage });






const requireAuth = require('../middleware/requireAuth')

// require auth for all news routes


//paginated documents
router.use(requireAuth)


//Get all documents
router.get('/', getDocuments)

router.get('/docs',getPaginatedDocuments)


//create a new docs
router.post('/createDocs', upload.single('pdfDocuments'),createDocument)
//Get single News

router.get('/:uid',getDocument)

//DELETE a News

router.delete('/:uid', deleteDocuments)


//Update a News?
router.patch('/updateDocs/:uid',upload.single('pdfDocuments'),updateDocuments)

module.exports = router