const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  meeting_name: { type: String, required: true },
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  total_users: { type: Number, default: 0 }, 
});

module.exports = mongoose.model('Meeting', meetingSchema);