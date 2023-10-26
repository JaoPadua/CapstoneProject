const express = require('express')
const {
    createNews,
    getNews,
    getNew,
    deleteNews,
    updateNews,
} = require("../controllers/newsController")

const router = express.Router()



//Get all News
router.get('/', getNews)


const requireAuth = require('../middleware/requireAuth')


// require auth for all news routes
router.use(requireAuth)

//Get single News

router.get('/:uid',getNew)

//Post a new News

router.post('/', createNews)

//DELETE a News

router.delete('/:uid', deleteNews)


//Update a News?

router.patch('/:uid',updateNews)

module.exports = router