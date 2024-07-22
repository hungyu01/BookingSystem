const express = require('express');
const router = express.Router();
const Space = require('../../models/sapce');

router.get('/add', (req, res) => {
  res.render('add-space', { title: '新增空間' });
});

router.post('/add', async (req, res) => {
  try {
    const space = new Space({
      name: req.body.name
    });
    await space.save();
    res.redirect('/homepage');
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;