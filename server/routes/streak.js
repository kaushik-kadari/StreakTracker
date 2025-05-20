const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const streakController = require('../controllers/streakController');

// All routes require authentication
router.use(auth);

// Get all streaks
router.get('/', streakController.getAllStreaks);

// Create a new streak
router.post('/', streakController.createStreak);

// Update a streak
router.put('/:id', streakController.updateStreak);

// Delete a streak
router.delete('/:id', streakController.deleteStreak);

// Complete a streak
router.post('/:id/complete', streakController.completeStreak);

module.exports = router;
