const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  // ⭐ Add this field for Fraud / Legit status
  status: {
    type: String,
    default: "Pending"   // can be: Pending, Fraud, Legit
  }
});

module.exports = mongoose.model("Job", JobSchema);