const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    content: { type: String, },
    image: { type: String },
    skillImage: [{ type: String }],
    roleCategory: {
      type: String,
      required: true,
      trim: true
    },    
    employmentType: { 
      type: String, 
      required: true, 
      enum: ["Full-time", "Part-time", "Contract", "Internship"] 
    },
    location: { type: String, },
    experience: { type: String, },
    noOfPositions: { type: Number, default: 1 },
    applicationDeadline: { type: Date },
    salary: { type: String },
    applyLink: { type: String },
    isFeatured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Career", careerSchema);

