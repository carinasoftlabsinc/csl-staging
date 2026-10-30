const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    keywords: [{ type: String }],
    iconImage: { type: String },
    cardBackgroundImage: { type: String },
    ratings: { type: Number, min: 0, max: 5 },
    downloads: { type: Number, default: 0 },
    // platforms: [{ type: String }],
    // platforms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Platform' }],
    platforms: [
      {
        name: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
    // Detail Page Content
    heroImage: { type: String },
    online: { type: Number, default: 0 },
    playingNow: { type: Number, default: 0 },
    heading: { type: String },
    content: { type: String },
    socialLinks: [{ name: String, url: String }],
    // socialLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialLink' }],
    trailer: {
      heading: { type: String },
      link: { type: String },
    },
    trailerImage: { type: String },
    galleryImages: [{ type: String }],
    cta: {
      heading: { type: String },
      description: { type: String },
    },
    ctaImage: { type: String },
    isFeature: { type: Boolean },
    featuredImage: { type: String },

    orderId: { type: Number, default: 0 },

    // new fields
    overviewImage: {
      type: String,
      default: null,
    }, 
    overviewPara: { type: String, default: null },
    techImages: [{ type: String }],
    industry: { type: String, default: null },
    keytasks: [{ type: String, default: null }], //
    goals: [
      {
        icon: { type: String, default: null },
        title: { type: String, default: null },
        description: { type: String, default: null },
      },
    ], 
    workSteps: [
      {
        icon: { type: String, default: null },
        title: { type: String, default: null },
        description: { type: String, default: null },
      },
    ],

    resultImages: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
