const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register a new user
router.post('/register', userController.register);
// Login a user
router.post('/login', userController.login);
// Get all users
router.get('/users', userController.getAllUsers);
// Get a specific user by ID
router.get('/users/:id', userController.getUserById);
// Update a user by ID
router.put('/users/:id', userController.updateUser);
// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);


module.exports = router;
