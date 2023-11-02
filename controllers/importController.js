const xlsx = require('xlsx');
const ImportedElder = require('../Models/importModels');
const upload = require('../middleware/multer')

const getImportElders = async(req,res) =>{
    const elders = await ImportedElder.find({}).sort({createdAt:-1})

    res.status(200).json(elders)
}

const searchImportElders = async (req, res) => {
    const { q } = req.query;
  
    const keys = ["LastName", "FirstName", "MiddleName", "Address", "BirthPlace", "Gender", "Barangay", "District","Zone"];
  
    const search = (data) => {
      return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };
  
    try {
      if (q) {
        const elders = await elderModels.find().exec();
        //console.log('Elder Records Found:', elders);
        const searchResults = search(elders);
        //console.log('Search Results:', searchResults);
        res.json(searchResults.slice(0, 10));
      } else {
        const elders = await elderModels.find({}).sort({ createdAt: -1 });
        res.json(elders);
      }
    } catch (error) {
      console.error('Error in searchElder:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };

const getImportedElder = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No Elder was Found'})
    }

    const elders = await elderModels.findById(uid)

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
    const elder = await elderModels.findOneAndDelete({_id:uid})

    if(!elder ) {
        return res.status(404).json({error: 'No elder Found'})
    }

    res.status(200).json(elder)
}

//update a users

const updateImportElder = async(req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no user to update'})
    }

    const elder = await elderModels.findByIdAndUpdate({_id:uid}, {
        ...req.body
    })

    if(!elder){
        return res.status(404).json({error:'No elder to Update'})
    }
    res.status(200).json(user)
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
      
      
    console.log('Data extracted from Excel:', data)

      const result = await ImportedElder.insertMany(data);
      res.status(200).json({ message: 'Data uploaded successfully', result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data to the database', details: error });
    }
  };
  

module.exports = {
  uploadExcel,
  searchImportElders,
  getImportElders,
  getImportedElder,
  updateImportElder,
  deleteImportElder,
};
