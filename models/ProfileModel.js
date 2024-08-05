const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  spaces: [{
    name: String
  }],
  startTime: String,
  endTime: String
});

module.exports = mongoose.model('Profile', ProfileSchema);
