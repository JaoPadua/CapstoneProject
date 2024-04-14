const express = require('express')

const {
    createDocument,
    getDocument,
    getDocuments,
    deleteDocuments,
    updateDocuments,
    getPaginatedDocuments,
    upload,
} = require("../controllers/documentsController")

const createLogMiddleware = require('../middleware/logsMiddleware');
const logDelete = createLogMiddleware('Deleted a Documents on document table')


const router = express.Router()

//Get all documents
router.get('/', getDocuments)


const requireAuth = require('../middleware/requireAuth')

// require auth for all news routes
router.use(requireAuth)


//create a new docs
router.post('/', upload.single('pdfDocuments'), createDocument)

//paginated news

router.get('/docs',getPaginatedDocuments)

//Get single News

//router.get('/:uid',getNew)

//Post a new News

router.post('/', createDocument);

//DELETE a News

router.delete('/:uid',logDelete, deleteDocuments)


//Update a News?
//router.patch('/:uid',logUpdate,updateNews)

module.exports = router