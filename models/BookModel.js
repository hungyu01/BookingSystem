const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
    name: String,
});

const TimeSlotSchema = new mongoose.Schema({
    start: String,
    end: String,
});

const BookingSchema = new mongoose.Schema({
    space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
    timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
    date: Date,
    name: String,
    email: String,
    purpose: String,
});

const Space = mongoose.model('Space', SpaceSchema);
const TimeSlot = mongoose.model('TimeSlot', TimeSlotSchema);
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { Space, TimeSlot, Booking };