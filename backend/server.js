require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/service-portal';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Backend is running successfully on port ' + PORT);
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.join('support_room');

    socket.on('send_message', async (data) => {
        // Automatically attach timestamp if missing
        if (!data.timestamp) data.timestamp = new Date();
        
        try {
            const newMsg = new Message({
                sender: data.sender || data.username || 'Unknown',
                text: data.text,
                room: data.room || 'support_room'
            });
            await newMsg.save();
        } catch (err) {
            console.error("Failed to save message to DB", err);
        }

        io.to('support_room').emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const ticketsRouter = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketsRouter);

const authRouter = require('./routes/authRoutes');
app.use('/api/auth', authRouter);

const projectRouter = require('./routes/projectRoutes');
app.use('/api/projects', projectRouter);

const commentRouter = require('./routes/commentRoutes');
app.use('/api/comments', commentRouter);

const requirementRouter = require('./routes/requirementRoutes');
app.use('/api/requirements', requirementRouter);

const chatRouter = require('./routes/chatRoutes');
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
