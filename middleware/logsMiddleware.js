// middleware/logMiddleware.js

const Logs = require('../Models/LogsModel');

const logMiddleware = (action) => async (req, res, next) => {
  try {
    // Log the action
    const log = new Logs({
      user: req.user._id,
      action: action,
      timestamp: new Date()
    });
    await log.save();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = logMiddleware;
