const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let userId;
    
    if (req.headers['x-user-id']) {
        try {
            userId = req.headers['x-user-id'];

            // Check if the ID provided is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(401).json({ message: 'Invalid User ID format' });
            }

            req.user = await User.findById(userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found, auth failed' });
            }

            if (req.user.status === 'Inactive') {
                return res.status(403).json({ message: 'Your account is currently inactive. Please contact an Admin.' });
            }
            
            next();
        } catch (error) {
            console.error('Auth verification error:', error);
            res.status(401).json({ message: 'Not authorized, identification failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no user ID provided' });
    }
};

module.exports = { protect };
