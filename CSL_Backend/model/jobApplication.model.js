const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Career" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    designation: { type: String },
    resume: { type: String },
    status: { 
      type: String, 
      enum: ["Pending", "Reviewed", "Rejected", "Accepted"], 
      default: "Pending" 
    },
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);
module.exports = JobApplication;
