const mongoose = require("mongoose");

const tmgsCareerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    content: { type: String, },
    image: { type: String },
    employmentType: { 
      type: String, 
      required: true, 
      enum: ["Full-time", "Part-time", "Contract", "Internship"] 
    },
    location: { type: String, },
    experience: { type: String, },
    applicationDeadline: { type: Date },
    applyLink: { type: String },
    isFeatured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TmgsCareer = mongoose.model("TmgsCareer", tmgsCareerSchema);
module.exports = TmgsCareer;
