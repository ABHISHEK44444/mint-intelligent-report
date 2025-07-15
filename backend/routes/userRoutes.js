import express from 'express';
const router = express.Router();
import {
    addUser,
    getUsers,
    getViewableUsers,
    resetPasswordByAdmin,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getUsers).post(protect, admin, addUser);
router.get('/viewable', protect, getViewableUsers);
router.post('/reset-password', protect, admin, resetPasswordByAdmin);

export default router;
