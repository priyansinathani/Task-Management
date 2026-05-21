const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Client', enum: ['Admin', 'Developer', 'Client'] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
