const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/task/:taskId', async (req, res) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId })
            .populate('user', 'username role')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { task, text } = req.body;
        const comment = new Comment({
            task,
            user: req.user._id,
            text
        });
        const savedComment = await comment.save();
        const populatedComment = await Comment.findById(savedComment._id).populate('user', 'username role');
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
