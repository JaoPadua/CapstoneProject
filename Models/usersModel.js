const mongoose = require('mongoose')


const Schema = mongoose.Schema

const usersSchema = new Schema({
    Date: {
        type:Date,
        default:Date.now
    },
    TypeofApplication:{
        type:String,
        required: true
    },
    SurName:{
        type:String,
        required:true
    },
    FirstName:{
        type:String,
        required:true
    },
    MiddleName:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    YrsofResidenceInManila:{
        type:Number,
        required:true
    },
    BirthPlace:{
        type:String,
        required:true
    },
    DateofBirth:{
        type:Date,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    Nationality:{
        type:String,
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    Barangay:{
        type:String,
        required:true
    },
    Zone:{
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    CivilStatus:{
        type:String,
        required:true
    },
    Salary:{
        type:Number,
        required:true
    },
    CellPhoneNumber:{
        type:Number,
        required:true
    },
    Pension:{
        type:Number,
        required:true
    },

    PresentWork:{
        type:String,
        required:true
    },

    ValidIdPresented:{
        type:String,
        required:true
    },
    Email:{
        type:String,
    },
    

},{timestamps:true})

module.exports = mongoose.model('EldersRegistrations',usersSchema)

