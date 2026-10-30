const mongoose = require('mongoose');

const tmgsBlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    titleLink: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    time: { type: String },
    author: { type: String, trim: true },
    content: { type: String },
    isFeature: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    orderIndex: { type: Number, default: 0 }, // 👈 ADD THIS
    faqs: [
      {
        question: { type: String, default: null },
        answer: { type: String, default: null },
      },
    ],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const tmgsBlog = mongoose.model('tmgsBlog', tmgsBlogSchema);
module.exports = tmgsBlog;
