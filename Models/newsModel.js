const mongoose= require('mongoose')



const Schema = mongoose.Schema

const newsSchema = new Schema({


    Title:{
        type:String,
        required: true,
    },

    Description:{
        type:String,
        required: true,
    },

    img:{
        type:String,
        required: true,
    },

    link:{
        type:String,
        required: true,
    }

},{timestamps:true})

newsSchema.virtual('decodedImg').get(function () {
    return `data:image/png;base64,${this.img}`;
  });


module.exports = mongoose.model('News',newsSchema)

