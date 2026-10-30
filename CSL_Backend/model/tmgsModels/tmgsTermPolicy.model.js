const mongoose = require('mongoose');

const termPolicySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['terms', 'privacy'], 
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
},{ timestamps: true });

const TermPolicy = mongoose.model('TmgsTermPolicy', termPolicySchema);

module.exports = TermPolicy;
