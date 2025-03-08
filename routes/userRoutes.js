const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');  // Import user controller
const { authenticate, authorize } = require('../middlewares/authMiddleware');  // Import middleware

// Only for Public Routes
router.post('/register', userController.register); // Anyone can register
router.post('/login', userController.login);       // Anyone can log in

// Protected Routes (Require Authentication)
router.get('/users', authenticate, authorize(['admin']), userController.getAllUsers);  // Admin only
router.get('/users/:id', authenticate, userController.getUserById);  // User can see own profile or admin can see any user
router.put('/users/:id', authenticate, userController.updateUser);   // User can update self or admin can update anyone
router.delete('/users/:id', authenticate, authorize(['admin']), userController.deleteUser);  // Admin only

module.exports = router;
