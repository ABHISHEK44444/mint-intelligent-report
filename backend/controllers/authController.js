import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, name, username, role) => {
    return jwt.sign({ id, name, username, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            token: generateToken(user._id, user.name, user.username, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// @desc    Check if a user exists
// @route   POST /api/auth/check-user
// @access  Public
const checkUserExists = async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') }});
    if (user) {
        res.status(200).json({ message: "User found" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};


// @desc    Reset user password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });

    if (user) {
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { loginUser, resetPassword, checkUserExists };
