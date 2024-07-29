const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: String
});

const TimeSlotSchema = new mongoose.Schema({
  slot: String
});

const BookingSchema = new mongoose.Schema({
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space'
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot'
  },
  name: String,
  phone: String,
  email: String,
  purpose: String
});

module.exports = {
  Space: mongoose.model('Space', SpaceSchema),
  TimeSlot: mongoose.model('TimeSlot', TimeSlotSchema),
  Booking: mongoose.model('Booking', BookingSchema)
};
