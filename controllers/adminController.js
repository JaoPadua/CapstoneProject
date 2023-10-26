const Admin = require('../Models/adminModels')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


//token
const createToken= (_id)=>{
 return jwt.sign({_id},process.env.SECRET, {expiresIn:'1d'})

}

// login a admin
const loginAdmin = async (req, res) => {
  const {email,password} = req.body
  
  try{
    const admin = await Admin.login(email,password)

    //create a token
    const token = createToken(admin._id)

    res.status(200).json({email, token})


  } catch (error){
    res.status(400).json({error:error.message})
  }
}


// signup a admin
const signupAdmin = async (req, res) => {
  const {firstName,lastName,email,password} = req.body

    try{
      const admin = await Admin.signup(firstName,lastName,email,password)

      //create a token
      const token = createToken(admin._id)

      res.status(200).json({firstName,lastName,email, token})


    } catch (error){
      res.status(400).json({error:error.message})
    }
}

//get all users for SuperAdmin
const getAdmin = async(req,res) =>{
  const admin = await Admin.find({}).sort({createdAt:-1})

  res.status(200).json(admin)
}

const deleteAdmin= async (req,res) =>{
  const {uid} = req.params

  if(!mongoose.Types.ObjectId.isValid(uid)){
      return res.status(404).json({error:'no admin to delete'})
  }
  const admin = await Admin.findOneAndDelete({_id:uid})

  if(!admin ) {
      return res.status(404).json({error: 'No admin Found'})
  }

  res.status(200).json(admin)
}

module.exports = { signupAdmin, loginAdmin, getAdmin,deleteAdmin }