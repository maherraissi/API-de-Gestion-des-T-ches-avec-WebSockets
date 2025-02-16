const Task = require('../models/taskModel');

// CREATE Task
exports.createTask = async (req, res) => {
    const { title, status , description  } = req.body;

    try {
        const task = new Task({ title, status });
        await task.save();
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
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving task', error });
    }
};

// UPDATE Task by ID
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { title, status }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
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
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
};