const Task = require('../models/taskModel');
const User = require('../models/userModel'); // Make sure to import the User model if needed

// CREATE Task
exports.createTask = async (req, res) => {
    const { title, description, status } = req.body;

    // Ensure that all required fields are provided
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
        let user = null;
        if (assignedTo) {
            user = await User.findById(assignedTo);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        const task = new Task({
            title, 
            description, 
            status: status || 'pending', // Default status
            assignedTo: user ? user._id : null // Assign user ID if user is found
        });

        await task.save();
        
        // Populate the assignedTo field before sending response
        const populatedTask = await Task.findById(task._id).populate('assignedTo');

        // Emit an event to all connected clients
        req.io.emit('taskCreated', populatedTask);

        res.status(201).json({ message: 'Task created successfully', task: populatedTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: 'Error creating task', error });
    }
};

// READ all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });

        // Emit an event when fetching all tasks
        req.io.emit('tasksFetched', tasks);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving tasks', error });
    }
};

// Get tasks assigned to the logged-in user
exports.getUserTasks = async (req, res) => {
    const userId = req.user.id; // Get the logged-in user's ID from the token

    try {
        // Query tasks assigned to the logged-in user
        const tasks = await Task.find({ assignedTo: userId });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks assigned to you' });
        }

        // Emit event to notify about user tasks being fetched
        req.io.emit('userTasksFetched', { userId, tasks });

        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ message: 'Error retrieving tasks', error });
    }
};


// READ single task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ task });

        // Emit an event when fetching a task
        req.io.emit('taskFetched', task);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving task', error });
    }
};

// UPDATE Task by ID
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { title, description, status, assignedTo }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Emit an event to notify clients of the update
        req.io.emit('taskUpdated', task);

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
};

// DELETE Task by ID
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Emit an event to notify clients of the deletion
        req.io.emit('taskDeleted', task);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
};

// Assign task to a user (admin only)
exports.assignTaskToUser = async (req, res) => {
    const { taskId, userId } = req.body;

    try {
        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assign the task to the user
        task.assignedTo = userId;
        task.status = 'assigned'; // Set status to 'assigned'
        task.updatedAt = Date.now();
        await task.save();

        // Emit event to notify the assigned user
        req.io.emit('taskAssigned', { task, user });

        res.status(200).json({ message: 'Task assigned successfully', task });
    } catch (error) {
        console.error('Assign Task Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User accepts the task
exports.acceptTask = async (req, res) => {
    const { taskId } = req.body;
    const userId = req.user.id; // Get the logged-in user's ID from the token

    try {
        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the task is assigned to this user
        if (task.assignedTo.toString() !== userId) {
            return res.status(403).json({ message: 'This task is not assigned to you' });
        }

        // Change status to 'accepted'
        task.status = 'accepted';
        task.updatedAt = Date.now();
        await task.save();

        // Emit event to notify of task acceptance
        req.io.emit('taskAccepted', task);

        res.status(200).json({ message: 'Task accepted successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User rejects the task
exports.rejectTask = async (req, res) => {
    const { taskId } = req.body;
    const userId = req.user.id; // Get the logged-in user's ID from the token

    try {
        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the task is assigned to this user
        if (task.assignedTo.toString() !== userId) {
            return res.status(403).json({ message: 'This task is not assigned to you' });
        }

        // Change status to 'rejected'
        task.status = 'rejected';
        task.updatedAt = Date.now();
        await task.save();

        // Emit event to notify of task rejection
        req.io.emit('taskRejected', task);

        res.status(200).json({ message: 'Task rejected successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User finishes the task
exports.finishTask = async (req, res) => {
    const { taskId } = req.body;
    const userId = req.user.id; // Get the logged-in user's ID from the token

    try {
        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the task is assigned to this user
        if (task.assignedTo.toString() !== userId) {
            return res.status(403).json({ message: 'This task is not assigned to you' });
        }

        // Change status to 'finished'
        task.status = 'finished';
        task.updatedAt = Date.now();
        await task.save();

        // Emit event to notify of task completion
        req.io.emit('taskFinished', task);

        res.status(200).json({ message: 'Task finished successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
