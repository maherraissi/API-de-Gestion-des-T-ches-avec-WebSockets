const express = require('express');
const router = express.Router();
const taskController = require('./taskController');

// Create a new task
router.post('/tasks', taskController.createTask);

// Get all tasks
router.get('/tasks', taskController.getAllTasks);

// Get a specific task by ID
router.get('/tasks/:id', taskController.getTaskById);

// Update a task by ID
router.put('/tasks/:id', taskController.updateTask);

// Delete a task by ID
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
