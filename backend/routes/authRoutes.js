import express from 'express';
const router = express.Router();
import { loginUser, resetPassword, checkUserExists } from '../controllers/authController.js';

router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/check-user', checkUserExists);

export default router;
