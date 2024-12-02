const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const UserMeeting = require('../models/UserMeeting');

router.post('/check', async (req, res) => {
    const { meeting_id, user_id } = req.body;

    try {
        const meeting = await Meeting.findById(meeting_id);
        if (!meeting) return res.status(404).send({ error: 'Meeting not found' });

        const userMeeting = await UserMeeting.findOne({ user_id, meeting_id });
        if (userMeeting) return res.status(400).send({ error: 'User already checked in' });

        const newUserMeeting = new UserMeeting({ user_id, meeting_id, status: 1 });
        await newUserMeeting.save();

        meeting.attendees.push(user_id);
        await meeting.save();

        res.status(200).send({ message: 'Attendance marked successfully', user: user_id });
    } catch (error) {
        res.status(500).send({ error: 'Failed to mark attendance' });
    }
});

module.exports = router;
