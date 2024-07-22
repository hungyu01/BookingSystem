var express = require('express');
var router = express.Router();
const { Space, TimeSlot, Booking } = require('../../models/BookModel');

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/homepage');
});

router.get('/homepage', (req, res) => {
  res.render('index', { title: 'Space Reservation' });
});


module.exports = router;
