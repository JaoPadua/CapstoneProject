const xlsx = require('xlsx');
const ImportedElder = require('../Models/importModels');
const upload = require('../middleware/multer')
const mongoose = require('mongoose')

const getImportElders = async(req,res) =>{
    //paginations
  const page = parseInt(req.query.page)  || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
  const totalElders = await ImportedElder.countDocuments();
  const totalPages = Math.ceil(totalElders / pageSize);  

  //search query
  const search = req.query.search || "";
  const keys = ["LAST NAME", "FIRST NAME", "MIDDLE NAME","SUFFIX  ", "STREET NAME", "GENDER", "BRGY", "DISTRICT NO","ZONE", "STATUS"];
  const searchQuery = keys.map(key => ({ [key]: { $regex: search, $options: "i" } }));

  
  const elders = await ImportedElder
  .find({  $or:searchQuery  })
  .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
  .skip((page - 1) * pageSize)
  .limit(pageSize); 

  // Apply slice to elders array to get the desired slice of data
  const slicedElders = elders.slice(0, 10);


    res.status(200).json({
      error:false ,
      totalElders,
      elders,
      currentPage: page,    
      totalPages,
      pageSize,
    });
}

const getAllImport = async(req,res) =>{
  const elders = await ImportedElder.find({}).sort({createdAt:-1})
  res.status(200).json(elders)
}


const getImportedElder = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No Elder was Found'})
    }

    const elders = await ImportedElder.findById(uid)

    if(!elders ) {
        return res.status(404).json({error: 'No user Found'})
    }

    res.status(200).json(elders)
}

//delete a users

const deleteImportElder = async (req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no elder to delete'})
    }
    const elder = await ImportedElder.findOneAndDelete({_id:uid})

    if(!elder ) {
        return res.status(404).json({error: 'No elder Found'})
    }

    res.status(200).json(elder)
}

//update a users
const updateImportElder = async(req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no elder to update'})
    }

    const elder = await ImportedElder.findByIdAndUpdate({_id:uid}, {
        ...req.body
    })

    if(!elder){
        return res.status(404).json({error:'No elder to Update'})
    }
    res.status(200).json(elder)
}


// Handle file upload and data insertion
const uploadExcel = async (req, res) => {
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
          if (err) {
            reject('File upload failed');
          }
          if (!req.file) {
            reject('No file uploaded');
          }
          resolve();
        });
      });
  
      await uploadPromise;
  
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      
    //console.log('Data extracted from Excel:', data)

      const result = await ImportedElder.insertMany(data);
      res.status(200).json({ message: 'Data uploaded successfully', result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data to the database', details: error });
    }
  };
  

module.exports = {
  uploadExcel,
  getAllImport,
  getImportElders,
  getImportedElder,
  updateImportElder,
  deleteImportElder,
};
