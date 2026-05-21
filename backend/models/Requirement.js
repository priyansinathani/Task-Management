const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Converted'] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Requirement', requirementSchema);
