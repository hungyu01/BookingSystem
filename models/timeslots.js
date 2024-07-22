const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  start: String,
  end: String,
});

module.exports = mongoose.model('timeslot', TimeSlotSchema);