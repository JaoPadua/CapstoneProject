const mongoose = require('mongoose');

const importDataSchema = new mongoose.Schema({
    BRGY:{
    type:String,
 },
 "LAST NAME":{
    type:String,
 },
 "FIRST NAME":{
    type:String,
 },
 "MIDDLE NAME":{
   type:String,
},
 SUFFIX:{
    type:String,
 },
 "BIRTH MONTH":{
    type:String,
 },
 "BIRTH DAY":{
   type:String,
},
"BIRTH YEAR":{
   type:String,
},
 Age:{
    type:Number,
 },
 "STREET NAME":{
    type:String,
 },
 "DISTRICT NO.":{
    type:String,
 },
 "DISTRICT NAME":{
    type:String,
 },
 ZONE:{
    type:String,
 },
 "MOBILE NO.":{
    type:String,
 },
 "OSCA ID NO.":{
    type:String,
 },
 "OSCA ID DATE ISSUED (MM/DD/YYY)": {
   type: String,
 },   
 "PAYMAYA SENIOR ID NO.":{
    type:String,
 },
 "PAYMAYA DATE REGISTERED (YYYY)":{
    type:String,
 },
 "PAYMAYA DATE VALIDITY (MM/YYYY)":{
    type:String,
 },
 GENDER:{
    type:String,
 },
 "CIVIL STATUS":{
    type:String,
 },
 VOTER:{
    type:String,
 },
 STATUS:{
    type:String,
 },


  // Add other fields as needed
},{timestamps:true})

module.exports = mongoose.model('ImportedElder', importDataSchema)
