
const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },
    titleLink: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    image_2: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    content: {
        type: String,
        default: null,  
    },
    feed: {
        type: [String],
        default: null,  
    },
    isFeature: {
      type: Boolean,
      default: false,
    },
    isPreviousFeature: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

const NewsRoom = mongoose.model('NewsRoom', NewsSchema);

module.exports = NewsRoom;
