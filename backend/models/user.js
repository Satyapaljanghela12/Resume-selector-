const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['admin', 'tpc', 'student'], default: 'student' },

  // ✅ Student-specific fields
  branch: { type: String },
  year: { type: String },
  academicYear: { type: String },
  cgpa: { type: String },
  skills: { type: [String], default: [] },
  resume: { type: String }, // stores resume file path

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
