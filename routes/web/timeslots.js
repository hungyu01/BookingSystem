const express = require('express');
const router = express.Router();
const TimeSlot = require('../../models/timeslots');

router.get('/add', (req, res) => {
  res.render('add-timeslot', { title: '新增時間段' });
});

router.post('/add', async (req, res) => {
  try {
    const timeslot = new TimeSlot({
      start: req.body.start,
      end: req.body.end
    });
    await timeslot.save();
    res.redirect('/homepage');
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;