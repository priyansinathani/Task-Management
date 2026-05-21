const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'taskphere_secret_key');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const lowercaseRoles = roles.map(r => r.toLowerCase());
        if (!req.user || !lowercaseRoles.includes(req.user.role?.toLowerCase())) {
            return res.status(403).json({ message: `User role ${req.user?.role} is not authorized` });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
