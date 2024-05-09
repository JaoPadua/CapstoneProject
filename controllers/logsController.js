// logsController.js
const Log = require('../Models/LogsModel');
const mongoose = require('mongoose')

const getAllLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Number of logs per page, default to 10 if not provided

  try {
    const count = await Log.countDocuments(); // Total number of logs
    const totalPages = Math.ceil(count / limit); // Calculate total number of pages
    const skip = (page - 1) * limit; // Calculate number of logs to skip

    const logs = await Log.find()
      .populate('user')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      logs,
      currentPage: page,
      totalPages,
      totalLogs: count
    });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getLog = async (req,res)=>{
  const { uid } =req.params

  if(!mongoose.isValidObjectId(uid)){
      return res.status(404).json({error:'No news was Found'})
  }

  const Logs = await Log.findById(uid)

  if(!Logs ) {
      return res.status(404).json({error: 'No news Found'})
  }

  res.status(200).json(Logs)
}



// delete logs
const deleteLogs = async (req,res) =>{
  const {uid} = req.params

  if(!mongoose.Types.ObjectId.isValid(uid)){
      return res.status(404).json({error:'no Logs to delete'})
  }
  const Logs = await Log.findOneAndDelete({_id:uid})

  if(!Logs ) {
      return res.status(404).json({error: 'No Logs Found'})
  }

  res.status(200).json(Logs)
}


module.exports = {
  getAllLogs,
  deleteLogs,
  getLog,
};

