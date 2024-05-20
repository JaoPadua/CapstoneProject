const mongoose = require('mongoose')


const Schema = mongoose.Schema

const verifiedElder = new Schema({
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
    Suffix:{
        type:String,
    },
    Address:{
        type:String,
        required:true
    },
    YrsofResidenceInManila:{
        type:String,
        required:true
    },
    BirthPlace:{
        type:String,
        required:true
    },
    DateOfBirth:{
        type:String,
        required:true
    },
    Gender:{
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
    Status:{
        type:String,
        required:true
    },
    CivilStatus:{
        type:String,
        required:true
    },
    MobilePhone:{
        type:String,
        required:true
    },




},{timestamps:true})

module.exports = mongoose.model('VerifiedElders', verifiedElder)