const elderModels = require('../Models/verifiedElderModel')
const userModels = require('../Models/usersModel')
const mongoose = require('mongoose')

//get all users
const getElders = async(req,res) =>{
    const elders = await elderModels.find({}).sort({createdAt:-1})

    res.status(200).json(elders)
}


//get a single users
const getElder = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No user was Found'})
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
        Address: user.Address,
        YrsofResidenceInManila: user.YrsofResidenceInManila,
        BirthPlace: user.BirthPlace,
        DateofBirth: user.DateofBirth,
        Gender: user.Gender,
        Age: user.Age,
        Barangay: user.Barangay,
        Zone: user.Zone,
        District: user.District,
        CivilStatus: user.CivilStatus,
        CellPhoneNumber: user.CellPhoneNumber,

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

    res.status(200).json(user)
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



module.exports = {
    moveElder,
    getElder,
    getElders,
    deleteElders,
    updateElders,
}