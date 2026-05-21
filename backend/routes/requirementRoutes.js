const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
    try {
        let reqs;
        if (req.user.role === 'Client' || req.user.role === 'user') {
            reqs = await Requirement.find({ client: req.user._id }).populate('project', 'name').populate('client', 'username').populate('developer', 'username');
        } else if (req.user.role?.toLowerCase() === 'developer') {
            reqs = await Requirement.find({ developer: req.user._id }).populate('project', 'name').populate('client', 'username').populate('developer', 'username');
        } else if (req.user.role === 'Admin') {
            reqs = await Requirement.find().populate('project', 'name').populate('client', 'username').populate('developer', 'username');
        } else {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(reqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, project } = req.body;
        const requirement = new Requirement({
            title,
            description,
            project,
            client: req.user._id
        });
        const savedReq = await requirement.save();
        res.status(201).json(savedReq);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id/status', authorizeRoles('Admin'), async (req, res) => {
    try {
        const reqItem = await Requirement.findById(req.params.id);
        if (!reqItem) return res.status(404).json({ message: 'Not found' });
        if (req.body.status) reqItem.status = req.body.status;
        if (req.body.developer) reqItem.developer = req.body.developer;
        const updated = await reqItem.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const reqItem = await Requirement.findById(req.params.id);
        if (!reqItem) return res.status(404).json({ message: 'Requirement not found' });
        
        if (reqItem.client.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        if (reqItem.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot edit a requirement that has been converted' });
        }

        if (req.body.title != null) reqItem.title = req.body.title;
        if (req.body.description != null) reqItem.description = req.body.description;
        if (req.body.project != null) reqItem.project = req.body.project;

        const updated = await reqItem.save();
        const populated = await Requirement.findById(updated._id).populate('project', 'name').populate('client', 'username');
        res.json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const reqItem = await Requirement.findById(req.params.id);
        if (!reqItem) return res.status(404).json({ message: 'Requirement not found' });

        if (reqItem.client.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        if (reqItem.status !== 'Pending' && req.user.role !== 'Admin') {
            return res.status(400).json({ message: 'Cannot delete a converted requirement' });
        }

        await reqItem.deleteOne();
        res.json({ message: 'Requirement deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
