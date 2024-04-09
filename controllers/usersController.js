const usersModel = require('../Models/usersModel.js')
const mongoose = require('mongoose')
const multer = require('multer')



//get all users
const getUsers = async (req, res) => {
    try {

      //let Users = []
      const page = parseInt(req.query.page)  || 1; // Default to page 1 if not specified
      const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
      
      const search = req.query.search || "";

      const totalUsers = await usersModel.countDocuments();
      const totalPages = Math.ceil(totalUsers / pageSize);
     
      const keys = ["SurName", "FirstName", "MiddleName", "Address", "BirthPlace", "Gender", "Barangay", "District","Zone"];
      const searchQuery = keys.map(key => ({ [key]: { $regex: search, $options: "i" } }));


      const users = await usersModel
        .find({  $or:searchQuery })
        .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
        .skip((page - 1) * pageSize)
        .limit(pageSize); 
  
      res.status(200).json({
        error:false ,
        totalUsers,
        users,
        currentPage: page,    
        totalPages,
        pageSize,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
//search users informations
const searchUsers = async (req, res) => {
    const { q } = req.query;
  
    const keys = ["SurName", "FirstName", "MiddleName", "Address", "BirthPlace", "Gender", "Barangay", "District","Zone"];
  
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes((q)))
      );
    };
  
    try {
      if (q) {
        const users = await usersModel.find().exec();
        const searchResults = search(users);
        res.json(searchResults.slice(0, 10));
      } else {
        const users = await usersModel.find({}).sort({createdAt:-1})
        res.json(users);
      }
    } catch (error) {
      console.error('Error in searchUsers:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  



//get a single users
const getUser = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No user was Found'})
    }

    const user = await usersModel.findById(uid)

    if(!user ) {
        return res.status(404).json({error: 'No user Found'})
    }

    res.status(200).json(user)
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
    const createUser = async(req,res) =>{
        /*const {Date,
            TypeofApplication,
            SurName,
            FirstName,
            MiddleName,
            Address,
            YrsofResidenceInManila,
            BirthPlace,
            DateOfBirth,
            Gender,
            Nationality,
            Age,
            Barangay,
            Zone,
            District,
            CivilStatus,
            MobilePhone,
            ValidIdPresented,
            } = req.body*/
            //const { ProofOfValidID } = req.file.filename
            /*(if (!req.file || !req.file.filename) {
                return res.status(400).json({ error: 'ProofOfValidID file is missing' });
            }
            // Now req.file.filename should contain the file name*/
            //adding users to database
        try{
          if (!req.file) {
            console.log('proofOFvalidID',req.file)
            return res.status(400).json({ error: 'No PDF uploaded' });
            
          }
           
              const pdfFileName = req.file.filename

               const user = await usersModel.create({
                //Date,
                TypeofApplication:req.body.TypeofApplication,
                SurName:req.body.SurName,
                FirstName:req.body.FirstName,
                MiddleName:req.body.MiddleName,
                Suffix:req.body.Suffix,
                Address:req.body.Address,
                YrsofResidenceInManila:req.body.YrsofResidenceInManila,
                BirthPlace:req.body.BirthPlace,
                DateOfBirth:req.body.DateOfBirth,
                Gender:req.body.Gender,
                Nationality:req.body.Nationality,
                Age:req.body.Age,
                Barangay:req.body.Barangay,
                Zone:req.body.Zone,
                District:req.body.District,
                CivilStatus:req.body.CivilStatus,
                MobilePhone:req.body.MobilePhone,
                ValidIdPresented:req.body.ValidIdPresented,
                ProofOfValidID:pdfFileName,
                /*ProofOfValidID:{
                    type:ProofOfValidID.buffer,
                    contentType:ProofOfValidID.mimetype,
                }*/
                });
                res.status(200).json(user)
                
        } catch(error){
            res.status(400).json({error:error.message })
        }
}


//delete a users

const deleteUsers = async (req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no user to delete'})
    }
    const user = await usersModel.findOneAndDelete({_id:uid})

    if(!user ) {
        return res.status(404).json({error: 'No user Found'})
    }

    res.status(200).json(user)
}

//update a users

const updateUsers = async(req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no user to update'})
    }

    const user = await usersModel.findByIdAndUpdate({_id:uid}, {
        ...req.body
    })

    if(!user){
        return res.status(404).json({error:'No user to Update'})
    }
    res.status(200).json(user)
}



module.exports = {
    createUser,
    getUser,
    getUsers,
    deleteUsers,
    updateUsers,
    searchUsers,
    upload,
}