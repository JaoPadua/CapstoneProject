const usersModel = require('../Models/usersModel.js')
const mongoose = require('mongoose')

//get all users
const getUsers = async(req,res) =>{
    const users = await usersModel.find({}).sort({createdAt:-1})

    res.status(200).json(users)
}


//get a single users
const getUser = async (req,res)=>{
    const { uid } =req.params

    if(!mongoose.isValidObjectId(uid)){
        return res.status(404).json({error:'No user was Found'})
    }

    const user = await usersModel.findById(uid)

    if(!user ) {
        return res.status(404).json({error: 'No user Found'})
    }

    res.status(200).json(user)
}

//create a new users
const createUser = async(req,res) =>{
    const {Date,
        TypeofApplication,
        SurName,
        FirstName,
        MiddleName,
        Address,
        YrsofResidenceInManila,
        BirthPlace,
        DateofBirth,
        Gender,
        Nationality,
        Age,
        Barangay,
        Zone,
        District,
        CivilStatus,
        Salary,
        CellPhoneNumber,
        Pension,
        PresentWork,
        ValidIdPresented,
        Email} = req.body

//adding users to database


        try{
            const user = await usersModel.create({
                Date,
                TypeofApplication,
                SurName,
                FirstName,
                MiddleName,
                Address,
                YrsofResidenceInManila,
                BirthPlace,
                DateofBirth,
                Gender,
                Nationality,
                Age,
                Barangay,
                Zone,
                District,
                CivilStatus,
                Salary,
                CellPhoneNumber,
                Pension,
                PresentWork,
                ValidIdPresented,
                Email})
                res.status(200).json(user)
        } catch(error){
            res.status(400).json({error:error.message })
        }
}


//delete a users

const deleteUsers = async (req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no user to delete'})
    }
    const user = await usersModel.findOneAndDelete({_id:uid})

    if(!user ) {
        return res.status(404).json({error: 'No user Found'})
    }

    res.status(200).json(user)
}

//update a users

const updateUsers = async(req,res) =>{
    const {uid} = req.params

    if(!mongoose.Types.ObjectId.isValid(uid)){
        return res.status(404).json({error:'no user to update'})
    }

    const user = await usersModel.findByIdAndUpdate({_id:uid}, {
        ...req.body
    })

    if(!user){
        return res.status(404).json({error:'No user to Update'})
    }
    res.status(200).json(user)
}



module.exports = {
    createUser,
    getUser,
    getUsers,
    deleteUsers,
    updateUsers,
}