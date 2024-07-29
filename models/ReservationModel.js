const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  space: String,
  timeSlot: String,
  name: String,
  phone: String,
  email: String,
  purpose: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
