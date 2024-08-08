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
  startTime: {
    type: String,   // 設定預約幾點開始
    required: true
  },
  endTime: {  // 設定預約幾點結束
    type: String,
    required: true
  },
  username: {   // 預約人名稱
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  email: {  // 新增 email 
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
