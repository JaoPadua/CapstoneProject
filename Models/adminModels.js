const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    
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
    role:{
        type:String,
        required:true,
    },

    


},{timestamps:true})

//static sign up method

adminSchema.statics.signup = async function (firstName,lastName,email,password,role) {
   

    //validator
    if(!email || !password || !firstName ||!lastName || !role){
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

    const admin = await this.create({firstName,lastName,email,role,password: hash})
    return admin
}

//static login method
adminSchema.statics.login = async function(email,password){

    if (!email || !password) {
        throw Error('All fields must be filled')
      }
      
      //const admin = await this.findOne({ email })
      const admin = await this.findOne({ email })
      //console.log('Returned Admin:', admin);
      if(!admin) {
          throw Error('Email or Password is Invalid')
      }
    
    //compare hashpassword to password

    const match = await bcrypt.compare(password, admin.password)

    if(!match ){
          throw Error('Email or Password is Invalid')
    }


     return admin ;
}
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;


//module.exports = mongoose.model("Admin",adminSchema )