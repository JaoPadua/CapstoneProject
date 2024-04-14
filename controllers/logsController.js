// logsController.js
const Admin = require('../Models/adminModels')
const Log = require('../Models/LogsModel');


const getAllLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
  const limit = parseInt(req.query.limit) || 15; // Number of logs per page, default to 10 if not provided

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


module.exports = {
  getAllLogs
};

