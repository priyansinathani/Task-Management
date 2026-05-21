const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

// Get dashboard summary stats
router.get('/dashboard/summary', async (req, res) => {
    try {
        let matchStage = {};
        if (req.user.role === 'Client') {
            matchStage = { creator: req.user._id };
        } else if (req.user.role?.toLowerCase() === 'developer') {
            matchStage = { assignee: req.user._id };
        }

        const total = await Ticket.countDocuments(matchStage);
        const open = await Ticket.countDocuments({ ...matchStage, status: { $in: ['To Do', 'In Progress'] } });
        const resolved = await Ticket.countDocuments({ ...matchStage, status: 'Done' });
        const warning = await Ticket.countDocuments({ ...matchStage, priority: { $in: ['High', 'Critical'] }, status: { $ne: 'Done' } });

        const recentTickets = await Ticket.find(matchStage).sort({ createdAt: -1 }).limit(5).populate('assignee', 'username').populate('project', 'name');

        const todo = await Ticket.countDocuments({ ...matchStage, status: 'To Do' });
        const inProgress = await Ticket.countDocuments({ ...matchStage, status: 'In Progress' });
        const done = await Ticket.countDocuments({ ...matchStage, status: 'Done' });

        const high = await Ticket.countDocuments({ ...matchStage, priority: 'High' });
        const medium = await Ticket.countDocuments({ ...matchStage, priority: 'Medium' });
        const low = await Ticket.countDocuments({ ...matchStage, priority: 'Low' });
        const critical = await Ticket.countDocuments({ ...matchStage, priority: 'Critical' });

        res.json({
            stats: { total, open, resolved, warning },
            recentTickets,
            priorities: [
                { name: 'High', value: high },
                { name: 'Medium', value: medium },
                { name: 'Low', value: low },
                { name: 'Critical', value: critical }
            ],
            statuses: [
                { name: 'To Do', value: todo },
                { name: 'In Progress', value: inProgress },
                { name: 'Done', value: done }
            ]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all tickets (filtered by project or assignee if provided)
router.get('/', async (req, res) => {
    try {
        let filter = {};
        if (req.query.projectId) {
            filter.project = req.query.projectId;
        }

        if (req.user.role?.toLowerCase() === 'developer') {
            filter.assignee = req.user._id;
            // Note: If they requested a specific project, we just narrow it to their assignments on that project.
        } else if (req.user.role === 'Client') {
            filter.creator = req.user._id;
        }

        const tickets = await Ticket.find(filter)
            .populate('assignee', 'username')
            .populate('project', 'name')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single ticket
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('assignee', 'username')
            .populate('project', 'name');
        if (ticket == null) {
            return res.status(404).json({ message: 'Cannot find ticket' });
        }
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one ticket
router.post('/', authorizeRoles('Admin', 'Client', 'Developer'), async (req, res) => {
    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority || 'Medium',
        status: req.body.status || 'To Do',
        project: req.body.project,
        deadline: req.body.deadline,
        assignee: req.body.assignee,
        creator: req.user._id
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one ticket
router.patch('/:id', authorizeRoles('Admin', 'Developer'), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (ticket == null) {
            return res.status(404).json({ message: 'Cannot find ticket' });
        }

        if (req.user.role?.toLowerCase() === 'developer' && String(ticket.assignee) !== String(req.user._id)) {
            return res.status(403).json({ message: 'You are only authorized to update tasks assigned directly to you.' });
        }

        if (req.body.title != null) ticket.title = req.body.title;
        if (req.body.description != null) ticket.description = req.body.description;
        if (req.body.category != null) ticket.category = req.body.category;
        if (req.body.priority != null) ticket.priority = req.body.priority;
        if (req.body.status != null) ticket.status = req.body.status;
        if (req.body.project != null) ticket.project = req.body.project;
        if (req.body.deadline != null) ticket.deadline = req.body.deadline;
        if (req.body.assignee != null) ticket.assignee = req.body.assignee;

        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Kanban Drag and Drop - Update Status specific endpoint
router.put('/:id/status', authorizeRoles('Admin', 'Developer'), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (ticket == null) {
            return res.status(404).json({ message: 'Cannot find ticket' });
        }

        if (req.user.role?.toLowerCase() === 'developer' && String(ticket.assignee) !== String(req.user._id)) {
            return res.status(403).json({ message: 'You can only move your own tasks on the Kanban board.' });
        }

        ticket.status = req.body.status;
        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one ticket
router.delete('/:id', authorizeRoles('Admin'), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (ticket == null) {
            return res.status(404).json({ message: 'Cannot find ticket' });
        }
        await ticket.deleteOne();
        res.json({ message: 'Deleted Ticket' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
