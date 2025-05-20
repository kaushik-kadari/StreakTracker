const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update profile method
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const updates = {};

        // Find the current user
        const currentUser = await User.findById(req.user.userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If trying to update password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to update password' });
            }
            
            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            // Hash new password
            updates.password = await bcrypt.hash(newPassword, 10);
        }

        // Update name and/or email if provided
        if (name) updates.name = name;
        if (email) updates.email = email;

        // Find and update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from the returned user object

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new token with updated user info
        const token = jwt.sign(
            { userId: updatedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            },
            token
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
