const Task = require('../models/taskModel');

// CREATE Task
exports.createTask = async (req, res) => {
    const { title, description, status } = req.body;

    try {
        const task = new Task({ title, description, status });
        await task.save();

        // Emit an event to all connected clients
        req.io.emit('taskCreated', task);

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
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
    const { title, description, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
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
