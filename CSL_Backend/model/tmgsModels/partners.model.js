const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true },
    url: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', partnerSchema);
