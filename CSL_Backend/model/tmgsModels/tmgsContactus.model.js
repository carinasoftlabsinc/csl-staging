const mongoose = require("mongoose");

const tmgsContactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

const TmgsContactUs = mongoose.model("TmgsContactUs", tmgsContactUsSchema);
module.exports = TmgsContactUs;
