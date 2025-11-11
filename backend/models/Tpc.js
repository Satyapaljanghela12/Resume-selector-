const mongoose = require('mongoose');

const tpcSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.models.Tpc || mongoose.model('Tpc', tpcSchema);
