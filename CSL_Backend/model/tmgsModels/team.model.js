const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  }
}, { timestamps: true });


module.exports = mongoose.model('Team', teamSchema);;
