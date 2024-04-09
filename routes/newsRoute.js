const express = require('express')
const {
    createNews,
    getNews,
    getNew,
    deleteNews,
    updateNews,
    getPaginatedNews,
} = require("../controllers/newsController")

const router = express.Router()

const createLogMiddleware = require('../middleware/logsMiddleware');
const logDelete = createLogMiddleware('Deleted News')
const logCreate = createLogMiddleware('Created a News')
const logUpdate =createLogMiddleware('Updated a News')


//Get all News
router.get('/', getNews)


const requireAuth = require('../middleware/requireAuth')


// require auth for all news routes
router.use(requireAuth)

//paginated news

router.get('/News',getPaginatedNews)

//Get single News

router.get('/:uid',getNew)

//Post a new News

router.post('/', createNews);

//DELETE a News

router.delete('/:uid',logDelete, deleteNews)


//Update a News?

router.put('/:uid',logUpdate,updateNews)

module.exports = router