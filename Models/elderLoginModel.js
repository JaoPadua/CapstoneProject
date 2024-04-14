const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema


const elderLoginSchema = new Schema({
    
    firstName:
    {
        type:String,
        required: true,
    },
    lastName:
    {
        type:String,
        required: true,
    },

    email:{
        type:String,
        required: true,
        unique: true,
    },

    password:{
        type:String,
        required: true,

    },
    

},{timestamps:true})


//static sign up method

elderLoginSchema.statics.signup = async function (firstName,lastName,email,password) {
   

    //validator
    if(!email || !password || !firstName ||!lastName){
        throw Error("All fields must be filled")
    }

    if(!validator.isEmail(email)){
        throw Error("Email is not valid")
    }
    if(!validator.isAlpha(lastName) && !validator.isAlpha(firstName)){
        throw Error("Name must be Alphabetical only")
    }

    const exist = await this.findOne({email})
    if(exist) {
        throw Error('Email is already in Use')
    }
    
    //password hashing

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password , salt)

    const ElderUser = await this.create({firstName,lastName,email,password: hash})
    return ElderUser
}


//static login method
elderLoginSchema.statics.login = async function(email,password){

    if (!email || !password) {
        throw Error('All fields must be filled')
      }
      
      //const admin = await this.findOne({ email })
      const ElderUser = await this.findOne({ email })
      //console.log('Returned ElderUser:', ElderUser);
      if(!ElderUser) {
          throw Error('Does not Exist')
      }
    
    //compare hashpassword to password

    const match = await bcrypt.compare(password, ElderUser.password)

    if(!match ){
          throw Error('Email or Password is Invalid')
    }


     return ElderUser ;
}

module.exports = mongoose.model("ElderLogin",elderLoginSchema )