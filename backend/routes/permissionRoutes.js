import express from 'express';
const router = express.Router();
import {
    getPermissions,
    addPermission,
    removePermission
} from '../controllers/permissionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, admin, getPermissions)
    .post(protect, admin, addPermission);

router.route('/:id')
    .delete(protect, admin, removePermission);

export default router;
