const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const elderModelsLogin = require('../Models/elderLoginModel')
const nodemailer =require('nodemailer');
const bcrypt = require('bcrypt')



//get per ID 

const getElderProfile = async (req,res) =>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No elder was Found'})
    }

    const elder = await elderModelsLogin.findById(uid)

    if(!elder ) {
        return res.status(404).json({error: 'No elder Found'})
    }

    res.status(200).json(elder)
}


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

  const checkConcurrentSession = (req, res, next) => {
    const { _id } = req.session.elderModelsLogin; // Assuming _id is present in elderModelsLogin
  
    let sessionID = req.cookies.myCookie; // Get the sessionID from the cookie
  
    // If sessionID doesn't exist in the cookie, generate a new one
    if (!sessionID) {
      sessionID = generateSessionID();
      res.cookie('myCookie', sessionID, { httpOnly: true });
    }
  
    // Check if the user is already logged in from another session
    if (activeSessions[_id] && activeSessions[_id] !== sessionID) {
      return res.status(403).json({ error: 'User already logged in from another session' });
    }
  
    // Update the active session for the user
    activeSessions[_id] = sessionID;
    console.log('Active session ID:', sessionID);
  
    next();
  };





//
const createToken= (_id)=>{
    return jwt.sign({_id},process.env.SECRET, {expiresIn:'1d'})
   
   }


// login a user on portal
const loginElder = async (req, res) => {
  const {email,password} = req.body
  
  try{
    const elder = await elderModelsLogin.login(email,password)


    
  // Extract firstName and lastName from elder data
  const { _id, firstName, lastName } = elder;
  
  const sessionID = generateSessionID();

  // Check if the user is already logged in
  if (activeSessions[email]) {
    return res.status(403).json({ error: 'User already logged in from another session',sessionID: activeSessions[email] });
  } else{
    delete activeSessions[email]
  }


//create a token
  const token = createToken(elder._id)

  req.session.elderModelsLogin = { _id: elder._id, email, firstName, lastName,sessionID};
  activeSessions[email] = req.sessionID;
  
  delete activeSessions[_id];


  // Set the cookie with the session ID
  res.cookie('myCookie', { sessionID }, { httpOnly: true });

  // Save session data to MongoDB
  //await saveSessionToMongoDB(sessionID, { _id: elder._id, email, firstName, lastName });


    res.status(200).json({firstName,lastName,email,token})
    //console.log('elder',elder)
   console.log('session',req.session.elderModelsLogin)
    console.log('sessionID:', sessionID);

  } catch (error){
    res.status(400).json({error:error.message})
  }
}



// logout Elder
const logoutElder = async (req, res) => { 
const { email } = req.body;

try {
if (!email) {
  return res.status(400).json({ error: 'Email parameter is missing or undefined' });
}

console.log('Before logout:', activeSessions);



if (!req.session) {
  return res.status(400).json({ error: 'No session found' });
}

res.clearCookie('connect.sid', { path: '/' });
res.clearCookie('myCookie')



req.session.destroy(err => {
  if (err) {
    return res.status(500).json({ error: 'Failed to log out' });
  }else{
    req.session = null;
    console.log("logout successful");
  }
  delete activeSessions[email];
  console.log('Session deleted successfully for email:', email);
  console.log('After logout:', activeSessions);
  res.status(200).json({ message: 'Logged out successfully' });
});

} catch (error) {
console.error('Error during logout:', error);
res.status(500).json({ error: 'Server error' });
}
};

  
  
  // signup a admin
    const signupElder = async (req, res) => {
      const {firstName,lastName,email,password} = req.body
      
      console.log('body', req.body)
    
        try{

        // Check if email already exists throw an error
        const exist = await elderModelsLogin.findOne({ email:email });
        if (exist) {
          return res.status(409).json({ status: "error", message: "Email already exists." });
      }  


          const elder = await elderModelsLogin.signup(firstName,lastName,email,password)
          console.log('elder',elder)
          //create a token
          const token = createToken(elder._id)
    
          res.status(200).json({firstName,lastName,email,token})
          
          
        } catch (error) {
          console.error('Error in signupElder:', error);
          res.status(500).json({ status: "error", message: "An error occurred during signup." });
      }      
         
    }
  

  const forgotPassword = async(req,res)=> {
    const {email} = req.body

    
  if (!email) {
    return res.status(400).json({ status: "Email is required" });
}  
    try{
      const oldUser = await elderModelsLogin.findOne({email:email})

      if(!oldUser){
        return res.status(404).json({ status: "error", message: "Elder not exist" });
      }
      const secret = process.env.SECRET + oldUser.password;
      const token = jwt.sign({id: oldUser._id},secret, {expiresIn:"1d"});


      
var transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  }
});

var mailOptions = {
  from: process.env.HOST,
  to: oldUser.email,
  subject: 'Reset Password',
  text: 'Please use the following link to reset your password:',
  html: `<p>Please use the following link to reset your password:</p><a href="https://elderlysquire.online/reset-password/${oldUser._id}/${token}">Reset Password</a>`

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


const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  console.log("ID:", id, "Token:", token);


  if (!password) {
    return res.status(400).json({ Status: "Password is required" });
}

  try {
      const oldUser = await elderModelsLogin.findById(id);
      if (!oldUser) {
          return res.status(404).send("User not found");
      }

     // Decode the token to extract user data without verifying its signature
     const decoded = jwt.decode(token);

     // Check if the ID in the token matches the ID in the request parameter
     if (!decoded || decoded.id !== id) {
       return res.status(401).json({ Status: "Invalid token" });
     }
 
       const secret = process.env.SECRET + oldUser.password;
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
      const updatedUser = await elderModelsLogin.findByIdAndUpdate({_id:id}, { password: hash }, { new: true });
      res.json({ Status: "Password updated successfully", User: updatedUser });
  } catch (error) {
      console.error(error);
      res.status(500).send("Server error during password reset.");
  }
};


  module.exports = { signupElder, loginElder,forgotPassword,resetPassword , getElderProfile,checkConcurrentSession,logoutElder}