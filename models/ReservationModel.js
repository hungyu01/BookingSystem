// models/Reservation.js

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  space: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
