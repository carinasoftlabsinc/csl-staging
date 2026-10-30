const mongoose = require('mongoose');

const CaseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },
    titleLink: {
      type: String,
      default: null,
    },
    category: {
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
    about_title: { type: String, default: null },
    aboutDescription: { type: String, default: null },
    aboutBg: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },
    solutionContent: {
      type: String,
      default: null,
    },
    industry: { type: String, default: null },
    tech: { type: String, default: null },
    deliverables: { type: String, default: null },
    projectLogo: { type: String, default: null },
    clientReview: { type: String, default: null },
    clientName: { type: String, default: null },
    designation: { type: String, default: null },

    developmentProcess: [
      {
        title: { type: String, default: null },
        logo: { type: String, default: null },
        description: { type: String, default: null },
      },
    ],
    title_1: { type: String, default: null },
    desc_1: { type: String, default: null },
    title_2: { type: String, default: null },
    desc_2: { type: String, default: null },
    title_3: { type: String, default: null },
    desc_3: { type: String, default: null },
    how_image: { type: String, default: null },

    // new fields

        headingIcon: {
      type: String,
      default: null,
    }, // new field
    overviewImage: {
      type: String,
      default: null,
    }, // new field
    overviewPara: { type: String, default: null }, // new field

    resultImages: [{ type: String }],
    resultHeading_1: { type: String, default: null },
    resultHeading_2: { type: String, default: null },

    keyHeading: { type: String, default: null },
    goalsHeading1: { type: String, default: null },
    goalsHeading2: { type: String, default: null },
    goalsHeading3: { type: String, default: null },
    keyDescription: { type: String, default: null },
    workSteps: [
      {
        title: { type: String, default: null },
        description: { type: String, default: null },
      },
    ],
    developement: [
      {
        title: { type: String, default: null },
        description: { type: String, default: null },
      },
    ],
    userFlowDescription: { type: String, default: null },
    uiImages: [{ type: String }],
    techImages: [{ type: String }],

    // Position within its category on the website (lower first); set from the admin reorder.
    orderIndex: { type: Number, default: 0 },
    // Inactive projects stay in the admin but are hidden from the website.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CaseStudy = mongoose.model('CaseStudy', CaseStudySchema);

module.exports = CaseStudy;
