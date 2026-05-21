const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
    try {
        // Return the last 100 messages chronologically
        const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
