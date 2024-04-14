const docsModels = require('../Models/documentsModels.js')
const mongoose = require('mongoose')
const multer = require('multer')
//const cloudinary = require("../utils/cloudinary");
const cloudinary = require('cloudinary').v2;



const getDocuments = async(req,res) =>{
    const docs = await docsModels.find({}).sort({createdAt:-1})
    res.status(200).json(docs)
}




//get all news with paginations
const getPaginatedDocuments = async (req,res) =>{
    const page = parseInt(req.query.page)  || 1; // Default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize) || 5; // Default to 10 items per page
    const totaldocuments = await docsModels.countDocuments();
    const totalPages = Math.ceil(totaldocuments / pageSize);  
  
    const documents = await docsModels
    .find({})
    .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
    .skip((page - 1) * pageSize)
    .limit(pageSize); 
  
    res.status(200).json({
      error:false ,
      totaldocuments,
      documents,
      currentPage: page,    
      totalPages,
      pageSize,
    });
  }





// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now()
      cb(null,file.originalname); // File naming convention
    },
  });
  
  const upload = multer({ storage: storage });
  
  
  //create a new users
      const createDocument = async(req,res) =>{
  
        const {
            title,
            descriptions,
        } = req.body;
  
        try {
          if (!req.file) {
              console.log('file',req.files)
              return res.status(400).json({ error: 'No PDF uploaded' });
          }
  
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'documents_pdf',
          });
  
  
          const docs = await docsModels.create({
             title,
             descriptions,
             pdfDocuments:{
                public_id: result.public_id,
                url: result.secure_url
              }
          });
          res.status(200).json(docs);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };
  
  
  
//delete a users

const deleteDocuments = async (req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no docs to delete'})
    }
    const docs = await docsModels.findOneAndDelete({_id:uid})

    if(!docs ) {
        return res.status(404).json({error: 'No docs Found'})
    }

    res.status(200).json(docs)
}



module.exports = {
    createDocument,
    getPaginatedDocuments,
    //getDocument,
    getDocuments,
    deleteDocuments,
    //updateDocuments,
    upload,
}