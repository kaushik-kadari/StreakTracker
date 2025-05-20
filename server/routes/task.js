const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// All routes require authentication
router.use(auth);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Toggle task completion
router.post('/:id/toggle', taskController.toggleTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
