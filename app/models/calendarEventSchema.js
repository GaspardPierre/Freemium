const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startTime: { type: Date, required: true },
  endTime: Date
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
