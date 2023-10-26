
const NewsModel = require('../Models/newsModel.js')
const mongoose = require('mongoose')

//get all news
const getNews = async(req,res) =>{
    const news = await NewsModel.find({}).sort({createdAt:-1})

    res.status(200).json(news)
}


//get a single News
const getNew = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No news was Found'})
    }

    const news = await NewsModel.findById(uid)

    if(!news ) {
        return res.status(404).json({error: 'No news Found'})
    }

    res.status(200).json(news)
}

//create a new News
const createNews = async(req,res) =>{
    const {Title,Description,img,link} = req.body

//adding News to database


        try{
            const user = await NewsModel.create({
                Title,Description,img,link})
                res.status(200).json(user)
        } catch(error){
            res.status(400).json({error:error.message })
        }
}


//delete a News

const deleteNews= async (req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no news to delete'})
    }
    const news = await NewsModel.findOneAndDelete({_id:uid})

    if(!news ) {
        return res.status(404).json({error: 'No news Found'})
    }

    res.status(200).json(news)
}

//update a News

const updateNews = async(req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no news to update'})
    }

    const news = await NewsModel.findByIdAndUpdate({_id:uid}, {
        ...req.body
    })

    if(!news){
        return res.status(404).json({error:'No news to Update'})
    }
    res.status(200).json(news)
}



module.exports = {
    createNews,
    getNew,
    getNews,
    deleteNews,
    updateNews,
}