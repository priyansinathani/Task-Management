const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'taskphere_secret_key', {
        expiresIn: '30d',
    });
};

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        const existingUserByName = await User.findOne({ username });
        if (existingUserByName) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'Client'
        });

        await newUser.save();
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { _id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role },
            token: generateToken(newUser._id)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials. Please register first.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials. Incorrect password.' });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            user: { _id: user._id, username: user.username, email: user.email, role: user.role },
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get all users (for assigning developers)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user's role
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['Admin', 'Developer', 'Client', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role provided' });
        }
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        user.role = role;
        await user.save();
        res.json({ message: 'Role updated successfully', user: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update personal profile
router.patch('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { username, email, currentPassword, newPassword } = req.body;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect current password' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.json({ message: 'Profile updated successfully', user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email or Username already taken by another user' });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
