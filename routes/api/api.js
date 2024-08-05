const express = require('express');
const router = express.Router();
const Profile = require('../../models/ProfileModel');
const Reservation = require('../../models/ReservationModel');
const ensureAuthenticated = require('../../middleware/auth')

// Get profile
router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Add a space
router.post('/profile/space', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    profile.spaces.push({ name: req.body.name });
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add space.' });
  }
});

// Delete a space
router.delete('/profile/space/:id', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    profile.spaces.id(req.params.id).remove();
    await profile.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete space.' });
  }
});

// Update time range
router.post('/profile/time', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    profile.startTime = req.body.startTime;
    profile.endTime = req.body.endTime;
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update time range.' });
  }
});

module.exports = router;
