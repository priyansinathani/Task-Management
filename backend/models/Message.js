const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    text: { type: String, required: true },
    room: { type: String, default: 'support_room' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
