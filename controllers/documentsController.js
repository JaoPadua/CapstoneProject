
const docsModels = require('../Models/documentsModels.js')
const mongoose = require('mongoose')
const multer = require('multer')
const cloudinary = require("../utils/cloudinary");
//const cloudinary = require('cloudinary').v2;



const getDocuments = async(req,res) =>{
    const docs = await docsModels.find({}).sort({createdAt:-1})
    res.status(200).json(docs)
}




//get all news with paginations
const getPaginatedDocuments = async (req,res) =>{
    const page = parseInt(req.query.page)  || 1; // Default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
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


//get a single docs
const getDocument = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No documents was Found'})
    }

    const docs = await docsModels.findById(uid)

    if(!docs ) {
        return res.status(404).json({error: 'No documents Found'})
    }

    res.status(200).json(docs)
}




  
  
  //create a new users
      const createDocument = async(req,res) =>{
  
        const {
            title,
            descriptions,
        } = req.body;
  
        try {
          if (!req.file) {
              console.log('file',req.file)
              return res.status(400).json({ error: 'No PDF uploaded' });
          }
          const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder: "documents_pdf",
          }
  
          const base64String = req.file.buffer.toString('base64');
          const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`,options);
   
  
  
          const docs = await docsModels.create({
             title,
             descriptions,
             pdfDocuments:{
                public_id: result.public_id,
                url: result.secure_url,
              }
          });
          console.log('docs',docs)
          res.status(200).json(docs);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };
  
  
  
//delete a documents

const deleteDocuments = async (req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no docs to delete'})
    }
    const docs = await docsModels.findOneAndDelete({_id:uid})
    const documentsPdfID = docs.pdfDocuments.public_id;
    await cloudinary.uploader.destroy(documentsPdfID);
    
    if(!docs ) {
        return res.status(404).json({error: 'No docs Found'})
    }
    res.status(200).send('Deleted Docs')
}

const updateDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { title, descriptions } = req.body;

        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return res.status(404).json({ error: 'Invalid document ID' });
        }

        const currentDocuments = await docsModels.findById(uid);

        if (!currentDocuments) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const data = {};

        // Update title if provided
        if (title) {
            data.title = title;
        } else {
            data.title = currentDocuments.title;
        }

        // Update descriptions if provided
        if (descriptions) {
            data.descriptions = descriptions;
        } else {
            data.descriptions = currentDocuments.descriptions;
        }

        // Update PDF if provided
        if (req.file) {
            const pdfID = currentDocuments.pdfDocuments ? currentDocuments.pdfDocuments.public_id : null;

            if (pdfID) {
                await cloudinary.uploader.destroy(pdfID);
            }

            const base64String = req.file.buffer.toString('base64');
            const newDocs = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`, {
                folder: "documents_pdf",
            });

            data.pdfDocuments = {
                public_id: newDocs.public_id,
                url: newDocs.secure_url
            };
        }

        const documentsUpdate = await docsModels.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json(documentsUpdate);
    } catch (error) {
        console.error(error);
        next(error);
    }
};




module.exports = {
    createDocument,
    getPaginatedDocuments,
    getDocument,
    getDocuments,
    deleteDocuments,
    updateDocuments,
}