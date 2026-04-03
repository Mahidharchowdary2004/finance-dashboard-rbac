const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
    const { name, email, password, role } = req.body;
    
    if (!name || name.trim() === '') {
        res.status(400);
        return next(new Error('Name is required'));
    }
    if (!email || !email.includes('@')) {
        res.status(400);
        return next(new Error('A valid email is required'));
    }
    if (!password || password.length < 6) {
        res.status(400);
        return next(new Error('Password must be at least 6 characters long'));
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error('User with this email already exists'));
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Viewer',
        });
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400);
        return next(new Error('Please provide email and password'));
    }

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    } catch (error) {
        next(error);
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, authorize(['Admin']), async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// @desc    Update user role (Admin only)
// @route   PATCH /api/auth/users/:id/role
// @access  Private/Admin
router.patch('/users/:id/role', protect, authorize(['Admin']), async (req, res, next) => {
    const { role } = req.body;
    try {
        const userToUpdate = await User.findById(req.params.id);
        if (!userToUpdate) {
            res.status(404);
            return next(new Error('User not found'));
        }

        // CONSTRAINT: Prevent downgrading the last Admin
        if (userToUpdate.role === 'Admin' && role !== 'Admin') {
            const adminCount = await User.countDocuments({ role: 'Admin' });
            if (adminCount <= 1) {
                res.status(400);
                return next(new Error('Cannot downgrade the only Admin in the system.'));
            }
        }

        userToUpdate.role = role || userToUpdate.role;
        const updatedUser = await userToUpdate.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update user status (Admin only)
// @route   PATCH /api/auth/users/:id/status
// @access  Private/Admin
router.patch('/users/:id/status', protect, authorize(['Admin']), async (req, res, next) => {
    try {
        const userToUpdate = await User.findById(req.params.id);
        if (!userToUpdate) {
            res.status(404);
            return next(new Error('User not found'));
        }

        // OPTIONAL: Prevent an Admin from deactivating themselves? 
        // Not explicitly asked, but "cannot delete" is the focus.
        
        userToUpdate.status = req.body.status || userToUpdate.status;
        const updatedUser = await userToUpdate.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, authorize(['Admin']), async (req, res, next) => {
    try {
        // CONSTRAINT: Admin cannot delete their own account
        if (req.user._id.toString() === req.params.id) {
            res.status(400);
            return next(new Error('Administrators cannot delete their own accounts via the dashboard.'));
        }

        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            res.status(404);
            return next(new Error('User not found'));
        }

        // CONSTRAINT: Prevent deleting the last Admin
        if (userToDelete.role === 'Admin') {
            const adminCount = await User.countDocuments({ role: 'Admin' });
            if (adminCount <= 1) {
                res.status(400);
                return next(new Error('Cannot delete the last Admin user. System must always have at least one administrator.'));
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
