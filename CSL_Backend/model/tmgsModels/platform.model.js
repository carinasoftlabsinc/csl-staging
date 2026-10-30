const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String }, // Optional, if platforms have icons
}, { timestamps: true });

module.exports = mongoose.model('Platform', platformSchema);
