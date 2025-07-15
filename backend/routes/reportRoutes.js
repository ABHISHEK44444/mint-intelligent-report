import express from 'express';
const router = express.Router();
import {
    getDailyReportsForUser,
    addDailyReport,
    updateDailyReport,
    getWeeklyPlansForUser,
    addWeeklyPlan,
    updateWeeklyPlan,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

// Daily Reports
router.route('/daily')
    .post(protect, addDailyReport);
    
router.route('/daily/:userId')
    .get(protect, getDailyReportsForUser);

router.route('/daily/:id')
    .patch(protect, updateDailyReport);

// Weekly Plans
router.route('/weekly')
    .post(protect, addWeeklyPlan);

router.route('/weekly/:userId')
    .get(protect, getWeeklyPlansForUser);

router.route('/weekly/:id')
    .patch(protect, updateWeeklyPlan);

export default router;
