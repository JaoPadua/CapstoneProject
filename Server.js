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

//Corrs to unblock Access-Control-Allow-Origin old corss
const cors =require('cors')
/*const corsOptions ={
    origin:'https://elderlysquire.online', 
    credentials:true,            //access-control-allow-credentials:true
    optionsSuccessStatus:200,
}
app.use(cors(corsOptions));*/


// CORS options
/*const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['https://elderlysquire.online', 'http://localhost:3000'];  // Add all your client URLs here
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);  // Allow
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Allows cookies and other credentials to be sent with the request
    optionsSuccessStatus: 200 // For legacy browser support (IE)
};*/

//app.use(cors(corsOptions));

//middleware
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "https://elderlysquire.online");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT,DELETE,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//app.use(cors())



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


