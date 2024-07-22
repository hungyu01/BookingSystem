const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('space', SpaceSchema);