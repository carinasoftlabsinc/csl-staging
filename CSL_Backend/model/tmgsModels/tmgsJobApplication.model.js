const mongoose = require("mongoose");

const tmgsJobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "TmgsCareer" },
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

const TmgsJobApplication = mongoose.model("TmgsJobApplication", tmgsJobApplicationSchema);
module.exports = TmgsJobApplication;
