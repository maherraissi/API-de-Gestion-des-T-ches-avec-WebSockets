const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Adjust path based on your project structure

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret');  // Use the same secret key that was used to sign the token

    // Attach the decoded user info to the request object (so it's available for route handlers)
    req.user = decoded;  // { userId, role, ... }

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Authorization Middleware (to check user roles)
const authorize = (roles = []) => {
  return (req, res, next) => {
    // If no roles are provided, authorize all users
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient role' });
    }
    next();  // Proceed to the next middleware or route handler
  };
};

module.exports = { authenticate, authorize };
