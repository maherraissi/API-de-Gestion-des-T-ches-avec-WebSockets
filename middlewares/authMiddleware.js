require('dotenv').config(); // Load environment variables
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Authentication Middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = {
            userId: user._id,
            role: user.role
        };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Authorization Middleware
const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId);
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Authorization error' });
        }
    };
};

module.exports = { authenticate, authorize };