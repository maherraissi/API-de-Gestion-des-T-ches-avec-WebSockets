const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Admin assigns task to user
router.put('/assign', authenticate, authorize(['admin']), taskController.assignTaskToUser);

// User accepts the task
router.put('/accept', authenticate, taskController.acceptTask);

// User finishes the task
router.put('/finish', authenticate, taskController.finishTask);

// Create a new task (Admin only)
router.post('/create', authenticate, authorize(['admin']), taskController.createTask);

// for user tasks
router.get('/user-tasks', authenticate, taskController.getUserTasks); 

// Get all tasks (Admin or User)
router.get('/all', authenticate, taskController.getAllTasks);

// Get a specific task by ID
router.get('/:id', authenticate, taskController.getTaskById);

// Update a task by ID
router.put('/:id', authenticate, taskController.updateTask);

// Delete a task by ID
router.delete('/:id', authenticate, taskController.deleteTask);

module.exports = router;
