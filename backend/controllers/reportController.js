import DailyReport from '../models/dailyReportModel.js';
import WeeklyPlan from '../models/weeklyPlanModel.js';
import User from '../models/userModel.js';
import Permission from '../models/permissionModel.js';

const checkViewPermission = async (viewerId, targetUserId) => {
    if (viewerId.toString() === targetUserId.toString()) return true;
    const viewer = await User.findById(viewerId);
    if (viewer.role === 'admin') return true;
    
    const permission = await Permission.findOne({ viewerId, targetId: targetUserId });
    return !!permission;
};

// --- DAILY REPORTS ---

export const getDailyReportsForUser = async (req, res) => {
    const { userId } = req.params;
    const hasPermission = await checkViewPermission(req.user.id, userId);
    
    if (!hasPermission) {
        return res.status(403).json({ message: 'Not authorized to view these reports' });
    }

    const reports = await DailyReport.find({ userId }).sort({ date: -1 });
    res.json(reports);
};

export const addDailyReport = async (req, res) => {
    const report = new DailyReport({ ...req.body, userId: req.user._id });
    const createdReport = await report.save();
    res.status(201).json(createdReport);
};

export const updateDailyReport = async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can add remarks' });
    }

    const report = await DailyReport.findById(id);
    if (report) {
        report.remarks = remarks || report.remarks;
        const updatedReport = await report.save();
        res.json(updatedReport);
    } else {
        res.status(404).json({ message: 'Report not found' });
    }
};

// --- WEEKLY PLANS ---

export const getWeeklyPlansForUser = async (req, res) => {
    const { userId } = req.params;
    const hasPermission = await checkViewPermission(req.user.id, userId);

    if (!hasPermission) {
        return res.status(403).json({ message: 'Not authorized to view these plans' });
    }
    
    const plans = await WeeklyPlan.find({ userId }).sort({ date: -1 });
    res.json(plans);
};

export const addWeeklyPlan = async (req, res) => {
    const plan = new WeeklyPlan({ ...req.body, userId: req.user._id });
    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
};

export const updateWeeklyPlan = async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body;
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can add remarks' });
    }

    const plan = await WeeklyPlan.findById(id);
    if (plan) {
        plan.remarks = remarks || plan.remarks;
        const updatedPlan = await plan.save();
        res.json(updatedPlan);
    } else {
        res.status(404).json({ message: 'Plan not found' });
    }
};
