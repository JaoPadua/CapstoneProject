// models/Log.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Admin = require('../Models/adminModels')

const logSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Admin' },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
