// models/Log.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docsSchema = new Schema({
  
   title: 
    {
        type:String,
        required: true,
    },
        
        descriptions:{
            type:String,
            required: true,
        },
    pdfDocuments:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    
    },{timestamps:true})

module.exports = mongoose.model("Documents", docsSchema);
