
const jwt = require('jsonwebtoken')
const Admin = require('../Models/adminModels')
const requireAuth = async (req,res,next) =>{

    //verify Authentication
    const {authorization} =req.headers

    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'}) 
    }

    const token = authorization.split(' ')[1]

    // Log the token here
    //console.log('Token:', token);
    
    try{
    
      const { _id } = jwt.verify(token, process.env.SECRET)
      
      req.user = await Admin.findOne({ _id }).select('_id')
        next()

    }catch(error){
        console.log(error)
        res.status(401).json({error:'Request is not authorized'})
    }

}

module.exports = requireAuth