// backend/models/Studentprofile.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, default: '' },
  year: { type: Number, default:1 },
  cgpa: { type: Number, default:0 },
  skills: [{ type: [String],default:[] }],
  resume: { type: String, default: '' }, // Path to uploaded resume
});

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
