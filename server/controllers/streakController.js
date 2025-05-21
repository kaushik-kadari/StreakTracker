const Streak = require('../models/Streak');
const User = require('../models/User');

// Get all streaks for a user
exports.getAllStreaks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const streaks = await Streak.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.json(streaks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new streak
exports.createStreak = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { name, description } = req.body;
        
        const streak = new Streak({
            userId,
            name,
            description,
        });

        await streak.save();
        res.status(201).json(streak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update a streak
exports.updateStreak = async (req, res) => {
    try {
        const { name, description, history, lastCompleted } = req.body;
        const updates = { name, description, updatedAt: new Date() };

        const streak = await Streak.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!streak) {
            return res.status(404).json({ message: 'Streak not found' });
        }

        res.json(streak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a streak
exports.deleteStreak = async (req, res) => {
    try {
        const streak = await Streak.findByIdAndDelete(req.params.id);

        if (!streak) {
            return res.status(404).json({ message: 'Streak not found' });
        }

        res.json({ message: 'Streak deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete a streak
exports.completeStreak = async (req, res) => {
    try {
        const streak = await Streak.findById(req.params.id);
        if (!streak) {
            return res.status(404).json({ message: 'Streak not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();
        // Format date as DD/MM/YYYY consistently
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayString = `${day}/${month}/${year}`;

        // console.log("today:", todayString, "lastCompleted:", streak.lastCompleted);

        // Check if streak was already completed today
        if (streak.history.includes(todayISO)) {
            return res.status(400).json({ message: 'Streak already completed today' });
        }

        // Add today to history
        streak.history.push(todayISO);
        streak.lastCompleted = todayString;
        streak.currentStreak++;
        streak.updatedAt = new Date();

        // Update best streak if needed
        if (streak.currentStreak > streak.bestStreak) {
            streak.bestStreak = streak.currentStreak;
        }

        await streak.save();
        res.json(streak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
