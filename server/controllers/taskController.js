const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks for a user
exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tasks = await Task.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.json(tasks);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { task, completed } = req.body;

        
        const newTask = new Task({
            userId,
            task,
            completed,
        });
        
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { task, completed } = req.body;
        const updates = { task, completed, updatedAt: new Date() };

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle task completion
exports.toggleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updates = {
            completed: !task.completed,
            updatedAt: new Date()
        };

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select('-__v');

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
