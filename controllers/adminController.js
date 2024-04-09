const Admin = require('../Models/adminModels')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


//token
const createToken= (_id)=>{
 return jwt.sign({_id,role:Admin.role},process.env.SECRET, {expiresIn:'1d'})

}

// login a admin
const loginAdmin = async (req, res) => {
  const {email,password} = req.body
  
  try{
    const admin = await Admin.login(email,password)

    //create a token
    const{role,firstName,lastName} = admin;
    const token = createToken(admin._id)

    res.status(200).json({firstName,lastName,email,role ,token})


  } catch (error){
    res.status(400).json({error:error.message})
  }
}


// signup a admin
const signupAdmin = async (req, res) => {
  const {firstName,lastName,email,password,role} = req.body
  
  //console.log('body', req.body)

    try{
      const admin = await Admin.signup(firstName,lastName,email,password,role)
      //console.log('admin',admin)
      //create a token
      const token = createToken(admin._id)

      res.status(200).json({firstName,lastName,email,role,token})


    } catch (error){
      res.status(400).json({error:error.message})
    }
}

//get all users for SuperAdmin
const getAdmin = async(req,res) =>{
  const admin = await Admin.find({}).sort({createdAt:-1})

  res.status(200).json(admin)
}


//get single admin
const getSingleAdmin = async (req,res)=>{
  try {
    const { uid } = req.params;

    if (!mongoose.isValidObjectId(uid)) {
      return res.status(404).json({ error: 'Invalid admin ID' });
    }

    const admin = await Admin.findById(uid);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Assuming admin.role contains the role of the admin
    res.status(200).json({ role: admin.role });
  } catch (error) {
    console.error('Error fetching admin role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




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




module.exports = { signupAdmin, loginAdmin, getAdmin,deleteAdmin,getSingleAdmin }