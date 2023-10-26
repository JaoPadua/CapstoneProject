require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const usersRoute = require('./routes/usersRoute')
const newsRoute = require('./routes/newsRoute')
const adminRoute = require('./routes/adminRoute')
const elderRoute = require('./routes/eldersRoute')
const mongoose = require('mongoose')



//express app call
const app = express()

//middleware

app.use(express.json())
//to make the image Base64 into small size

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));



//Corrs to unblock Access-Control-Allow-Origin
const cors =require('cors')
app.use(cors())



//middleware
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

//routes
app.use(express.json())
app.use('/api/usersRoute', usersRoute)
app.use('/api/newsRoute', newsRoute )
app.use('/api/adminRoute', adminRoute )
app.use('/api/elderRoute', elderRoute)


//connecting to db
mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    
    //listen request
    app.listen(PORT, () =>{
        console.log('connected to db/Mongodb & listening to port',PORT)
    })
})
    .catch((error)=>{
        console.log(error)
    })


