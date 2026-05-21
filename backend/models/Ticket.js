const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String }, // Made optional as tasks may not have specific categories initially
    priority: { type: String, default: 'Medium', enum: ['Low', 'Medium', 'High', 'Critical'] },
    status: { type: String, default: 'To Do', enum: ['To Do', 'In Progress', 'Done', 'Open', 'Resolved', 'Closed'] }, // kept old statuses for backwards compatibility
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    deadline: { type: Date },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
