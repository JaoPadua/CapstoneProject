require('dotenv').config()

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const usersRoute = require('./routes/usersRoute')
const newsRoute = require('./routes/newsRoute')
const adminRoute = require('./routes/adminRoute')
const elderRoute = require('./routes/eldersRoute')
const importElder = require('./routes/importRoute')
const smsRoute = require('./routes/smsRoute')
const portalRoute = require('./routes/elderLoginRoute')
const actionLogsRoute = require('./routes/actionLogsRoute')
const docsRoute = require('./routes/docsRoute')
const mongoose = require('mongoose')




//express app call
const app = express()

//middleware

app.use(express.json())
//to make the image Base64 into small size

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use("/uploads",express.static("uploads"))

//Corrs to unblock Access-Control-Allow-Origin
const cors =require('cors')
app.use(cors())



//middleware
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

//api

app.get("/", (req,res) =>{
    res.send("WELCOME TO OSCA")
}
)

//routes
app.use(express.json())

{/* Admin routes*/}
app.use('/api/usersRoute', usersRoute)
app.use('/api/newsRoute', newsRoute )
app.use('/api/adminRoute', adminRoute )
app.use('/api/elderRoute', elderRoute)
app.use('/api/importRoute',importElder)
app.use('/api/smsRoute', smsRoute)
app.use('/api/getLogs',actionLogsRoute)
app.use ('/api/docsRoute' , docsRoute)


{/*Portal Routes*/}
app.use('/api/elderPortal',portalRoute)

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


