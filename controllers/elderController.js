const elderModels = require('../Models/verifiedElderModel')
const userModels = require('../Models/usersModel')
const mongoose = require('mongoose')

//get all users
const getElders = async(req,res) =>{
  const page = parseInt(req.query.page)  || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
  const totalElders = await elderModels.countDocuments();
  const totalPages = Math.ceil(totalElders / pageSize);  

  const search = req.query.search || "";
  const keys = ["SurName", "FirstName", "MiddleName", "Address", "BirthPlace", "Gender", "Barangay", "District","Zone"];
  const searchQuery = keys.map(key => ({ [key]: { $regex: search, $options: "i" } }));

  const elders = await elderModels
  .find({  $or:searchQuery.slice(0,10) })
  .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
  .skip((page - 1) * pageSize)
  .limit(pageSize); 

    res.status(200).json({
      error:false ,
      totalElders,
      elders,
      currentPage: page,    
      totalPages,
      pageSize,
    });
}

// search elders
const searchElders = async (req, res) => {
  const { q } = req.query;

  const keys = ["SurName", "FirstName", "MiddleName", "Address", "BirthPlace", "Gender", "Barangay", "District","Zone"];

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



//get a single users
const getElder = async (req,res)=>{
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

//move a new elder
const moveElder = async (req, res) => {
    const { uid } = req.params;
  
    try {
      // 1. Retrieve user data from the source collection
      const user = await userModels.findById(uid);
  
      if (!user) {
        return res.status(404).json({ message: 'Elder not found' });
      }
  
      // 2. Create a new customer record in the destination collection
      const newElder = new elderModels({
        TypeofApplication: user.TypeofApplication,
        FirstName: user.FirstName, // You can map user data to customer fields
        SurName: user.SurName,  // as needed for your use case.
        MiddleName: user.MiddleName,
        Suffix: user.Suffix,
        Address: user.Address,
        YrsofResidenceInManila: user.YrsofResidenceInManila,
        BirthPlace: user.BirthPlace,
        DateOfBirth: user.DateOfBirth,
        Gender: user.Gender,
        Age: user.Age,
        Barangay: user.Barangay,
        Zone: user.Zone,
        District: user.District,
        CivilStatus: user.CivilStatus,
        MobilePhone: user.MobilePhone,

        // Add other customer-specific fields as necessary.
      });
  
      await newElder.save();
  
      // 3. Optionally, remove the user record from the source collection
      await userModels.findByIdAndDelete(uid);
  
      res.json({ message: 'User moved to Elders collection' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };



//delete a users

const deleteElders = async (req,res) =>{
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

const updateElders = async(req,res) =>{
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

//Export Elder via Barangay 

const exportElder = async(req,res) =>{
  const Barangay = req.params.Barangay;

  try {
    const elderExport = await elderModels.find({Barangay});
    res.status(200).json(elderExport);
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error')
  }

}

module.exports = {
    moveElder,
    getElder,
    getElders,
    deleteElders,
    updateElders,
    searchElders,
    exportElder,
}