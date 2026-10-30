const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  clicks: { type: Number, default: 0 } // track how many times each URL is clicked
});

const AdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orientation: {
    type: String,
    enum: ['landscape', 'portrait'],
    required: true
  },
  image: { type: String, required: true },
  videoFile: { type: String },
  videoUrl: { type: String },
  duration: { type: Number, required: true },
  active: { type: Boolean, default: false },
  viewThreshold: { type: Number, default: 7 }, // set by game dev
  playCount: { type: Number, default: 0 },
  platforms: [PlatformSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Ad', AdSchema);
