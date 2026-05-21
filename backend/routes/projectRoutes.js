const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'Admin') {
            projects = await Project.find().populate('admin', 'username').populate('developers', 'username').populate('client', 'username');
        } else if (req.user.role === 'Developer') {
            projects = await Project.find({ developers: req.user._id }).populate('admin', 'username').populate('developers', 'username').populate('client', 'username');
        } else {
            projects = await Project.find({ client: req.user._id }).populate('admin', 'username').populate('developers', 'username').populate('client', 'username');
        }
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('admin', 'username')
            .populate('developers', 'username email')
            .populate('client', 'username email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authorizeRoles('Admin'), async (req, res) => {
    try {
        const { name, description, developers, client, endDate } = req.body;
        const project = new Project({
            name,
            description,
            admin: req.user._id,
            client: client || null,
            endDate: endDate || null,
            developers: developers || []
        });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', authorizeRoles('Admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (req.body.name != null) project.name = req.body.name;
        if (req.body.description != null) project.description = req.body.description;
        if (req.body.status != null) project.status = req.body.status;
        if (req.body.developers != null) project.developers = req.body.developers;
        if (req.body.client !== undefined) project.client = req.body.client || null;
        if (req.body.endDate !== undefined) project.endDate = req.body.endDate || null;

        const updatedProject = await project.save();
        // Return populated project so the frontend can display developer names properly
        const populatedProject = await Project.findById(updatedProject._id)
            .populate('admin', 'username')
            .populate('developers', 'username')
            .populate('client', 'username');
            
        res.json(populatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authorizeRoles('Admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
