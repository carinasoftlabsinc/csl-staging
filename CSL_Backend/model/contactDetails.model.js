
const mongoose = require('mongoose');

const ContactDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    service: {
      type: String,
      default: null,
    },
    budget: {
        type: String,
        default: null,
    },
    from: {
        type: String,
        default: null
    }
  },
  { timestamps: true }
);

const ContactDetail = mongoose.model('ContactDetail', ContactDetailsSchema);

module.exports = ContactDetail;
