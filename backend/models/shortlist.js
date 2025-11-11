// backend/models/Shortlist.js
const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.Shortlist || mongoose.model('Shortlist', shortlistSchema);
