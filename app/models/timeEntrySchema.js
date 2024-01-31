const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: Date,
  description: String
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
