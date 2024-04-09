const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const elderModelsLogin = require('../Models/elderLoginModel')

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
    const { firstName, lastName } = elder;
      //create a token
      const token = createToken(elder._id)
  
      res.status(200).json({firstName,lastName,email,token})
  
  
    } catch (error){
      res.status(400).json({error:error.message})
    }
  }
  
  
  // signup a admin
  const signupElder = async (req, res) => {
    const {firstName,lastName,email,password} = req.body
    
    console.log('body', req.body)
  
      try{
        const elder = await elderModelsLogin.signup(firstName,lastName,email,password)
        console.log('elder',elder)
        //create a token
        const token = createToken(elder._id)
  
        res.status(200).json({firstName,lastName,email,token})
  
  
      } catch (error){
        res.status(400).json({error:error.message})
      }
  }
  

  module.exports = { signupElder, loginElder}