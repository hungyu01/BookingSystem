const express = require('express');
const router = express.Router();
const { Space, TimeSlot, Booking } = require('../../models/BookModel');

router.get('/spaces', async (req, res) => {
  const spaces = await Space.find();
  res.json(spaces);
});

router.get('/timeslots', async (req, res) => {
  const timeSlots = await TimeSlot.find();
  res.json(timeSlots);
});

router.post('/bookings', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json(booking);
});

router.post('/spaces', async (req, res) => {
  const space = new Space(req.body);
  await space.save();
  res.json(space);
});

router.post('/timeslots', async (req, res) => {
  const timeSlot = new TimeSlot(req.body);
  await timeSlot.save();
  res.json(timeSlot);
});

router.delete('/spaces/:id', async (req, res) => {
  await Space.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

router.delete('/timeslots/:id', async (req, res) => {
  await TimeSlot.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
