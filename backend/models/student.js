const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  branch: String,
  year: String,
  cgpa: { type: Number, default: 0 },
  skills: [String],
  resume: String,
  resumeFile: {
    data: Buffer,
    contentType: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "inactive",
  },
}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
