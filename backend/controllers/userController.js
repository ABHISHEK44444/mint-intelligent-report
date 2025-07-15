import User from '../models/userModel.js';
import Permission from '../models/permissionModel.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Add a new user
// @route   POST /api/users
// @access  Private/Admin
const addUser = async (req, res) => {
    const { name, username, password, role } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, username, password, role });

    if (user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            username: user.username,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get users that the current user can view
// @route   GET /api/users/viewable
// @access  Private
const getViewableUsers = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ message: 'Not authorized' });

    if (currentUser.role === 'admin') {
        const allUsers = await User.find({}).select('-password');
        return res.json(allUsers);
    }

    const permissions = await Permission.find({ viewerId: currentUser._id });
    const targetIds = permissions.map(p => p.targetId);
    
    const viewableUserIds = [currentUser._id, ...targetIds];
    
    const users = await User.find({ '_id': { $in: viewableUserIds } }).select('-password');
    res.json(users);
};


// @desc    Reset password for a user by an admin
// @route   POST /api/users/reset-password
// @access  Private/Admin
const resetPasswordByAdmin = async (req, res) => {
    const { userId, newPassword } = req.body;
    const user = await User.findById(userId);

    if (user) {
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot reset password for an admin' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { getUsers, addUser, getViewableUsers, resetPasswordByAdmin };
