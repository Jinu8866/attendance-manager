const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const userRoutes = require('./routes/userRoutes');
const Meeting = require('./models/Meeting');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/user', userRoutes);

app.post('/api/attendance/qrcode', async (req, res) => {
    const { meeting_id } = req.body;

    try {
        const meeting = await Meeting.findById(meeting_id);
        if (!meeting) return res.status(404).send({ error: 'Meeting not found' });

        const qrData = `https://server-url/api/attendance/check?meeting_id=${meeting_id}`;
        const qrCodeImage = await QRCode.toDataURL(qrData);

        meeting.qr_code = qrCodeImage;
        await meeting.save();

        res.status(201).send({
            message: 'QR code generated successfully',
            qr_code: qrCodeImage,
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to generate QR code' });
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app;
