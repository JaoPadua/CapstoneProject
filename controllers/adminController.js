const Admin = require('../Models/adminModels')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const nodemailer =require('nodemailer');
const bcrypt = require('bcrypt')

// Middleware to check concurrent sessions

const generateSessionID = (length = 16) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionID = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      sessionID += characters.charAt(randomIndex);
  }
  return sessionID;
};

  const activeSessions = {};

  const checkConcurrentSessionAdmin = (req, res, next) => {
    const { _id } = req.session.Admin; // Assuming _id is present in elderModelsLogin
  
    let adminsessionID = req.cookies.myCookieAdmin; // Get the sessionID from the cookie
  
    // If sessionID doesn't exist in the cookie, generate a new one
    if (!adminsessionID) {
      adminsessionID = generateSessionID();
      res.cookie('AdminmyCookie', adminsessionID, { httpOnly: true });
    }
  
    // Check if the user is already logged in from another session
    if (activeSessions[_id] && activeSessions[_id] !== adminsessionID) {
      return res.status(403).json({ error: 'User already logged in from another session' });
    }
  
    // Update the active session for the user
    activeSessions[_id] = adminsessionID;
    console.log('Active Admin session ID:', adminsessionID);
  
    next();
  };



//token
const createToken= (_id)=>{
 return jwt.sign({_id,
  firstName:Admin.firstName,lastName:Admin.lastName,role:Admin.role}
  ,process.env.SECRET, {expiresIn:'1d'})

}

// login a admin
const loginAdmin = async (req, res) => {
  const {email,password} = req.body
  
  try{
    const admin = await Admin.login(email,password)

    //create a token
    const{_id,role,firstName,lastName} = admin;

    const sessionID = generateSessionID();

    // Check if the user is already logged in
    if (activeSessions[email]) {
      return res.status(403).json({ error: 'User already logged in from another session',adminsessionID: activeSessions[email] });
    } else{
      delete activeSessions[email]
    }
  
    req.session.Admin = { _id: admin._id, email, firstName, lastName,role};
    activeSessions[email] = req.sessionID;
    
    delete activeSessions[_id];


    // Set the cookie with the session ID
    res.cookie('AdminmyCookie', { sessionID }, { httpOnly: true });

    const token = createToken(admin._id)

    res.status(200).json({firstName,lastName,email,role ,token})

    console.log('Admin session',req.session.Admin)
    console.log('admin sessionID:', sessionID);

  } catch (error){
    res.status(400).json({error:error.message})
  }
}


//logout admin
const logoutAdmin = async (req, res) => { 
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is missing or undefined' });
    }




    console.log('Before logout:', activeSessions);

    if (!req.session) {
      return res.status(400).json({ error: 'No session found' });
    }

   res.clearCookie('connect.sid', { path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'none' });
    res.clearCookie('AdminmyCookie', { path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'none' });

    delete activeSessions[email];
    if(req.session){
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }

      console.log('Session deleted successfully for email:', email);
      console.log('After logout:', activeSessions);
      res.status(200).json({ message: 'Logged out successfully' });
    });
  }
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// signup a admin
const signupAdmin = async (req, res) => {
  const {firstName,lastName,email,password,role} = req.body
  
  //console.log('body', req.body)

    try{
        // Check if email already exists throw an error
        const exist = await Admin.findOne({ email:email });
        if (exist) {
          return res.status(409).json({ status: "error", message: "Admin Email already exists." });
      }  

      
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


const forgotAdminPassword = async(req,res)=> {
  const {email} = req.body


  if (!email) {
    return res.status(400).json({ status: "Email is required" });
}  

  try{
    const oldAdmin = await Admin.findOne({email:email})

    if(!oldAdmin){
      return res.status(404).json({ status: "error", message: "Admin not exist" });
    }
    const secret = process.env.SECRET + oldAdmin.password;
    const token = jwt.sign({id: oldAdmin._id},secret, {expiresIn:"1d"});


    
var transporter = nodemailer.createTransport({
service: process.env.SERVICE,
auth: {
  user: process.env.USER,
  pass: process.env.PASS,
}
});

var mailOptions = {
from: process.env.HOST,
to: oldAdmin.email,
subject: 'Reset Admin Password',
text: 'Please use the following link to reset your Admin password:',
html: `<p>Please use the following link to reset your password:</p><a href="https://elderlysquire.online/reset-AdminPassword/${oldAdmin._id}/${token}">Reset Admin Password</a>`

};

transporter.sendMail(mailOptions, function (error, info) {
if (error) {
  console.error(error);
  return res.status(500).json({ status: "Error sending email" });
} else {
  console.log('Email sent: ' + info.response);
  return res.json({ status: 'Email sent: ' + info.response });
}
});
} catch (error) {
console.error(error);
return res.status(500).json({ status: "Server error" });
}
};

const resetAdminPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  //console.log("ID:", id, "Token:", token);

  if (!password) {
    return res.status(400).json({ Status: "Password is required" });
}

  try {
      const oldAdmin = await Admin.findById(id);
      if (!oldAdmin) {
          return res.json(404).send("Admin not found");
      }

       // Decode the token to extract user data without verifying its signature
    const decoded = jwt.decode(token);

    // Check if the ID in the token matches the ID in the request parameter
    if (!decoded || decoded.id !== id) {
      return res.status(401).json({ Status: "Invalid token" });
    }

      const secret = process.env.SECRET + oldAdmin.password;
      try {
         jwt.verify(token, secret); 
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ Status: "Token expired" });
        } else {
            return res.status(401).json({ Status: "Invalid or expired token" });
        }
    }

      // Generate a salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Update the user with the new hashed password
      const updatedAdmin = await Admin.findByIdAndUpdate({_id:id}, { password: hash }, { new: true });
      res.json({ Status: "Password updated successfully", User: updatedAdmin });
  } catch (error) {
      console.error(error);
      res.status(500).send("Server error during password reset.");
  }
};




module.exports = { signupAdmin, loginAdmin, getAdmin,deleteAdmin,getSingleAdmin,forgotAdminPassword,resetAdminPassword,checkConcurrentSessionAdmin,logoutAdmin }
