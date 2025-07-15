
import { User, Role, DailyReport, WeeklyPlan, Permission } from '../types';

export let mockUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin', name: 'Admin', role: Role.ADMIN },
  { id: '2', username: 'gulshan', password: 'password', name: 'Gulshan Kumar', role: Role.USER },
  { id: '3', username: 'yspal', password: 'password', name: 'Yaspal Singh', role: Role.USER },
  { id: '4', username: 'manish', password: 'password', name: 'Manish Rawat', role: Role.USER },
];

export const mockDailyReports: DailyReport[] = [
    {
        id: 'dr1', userId: '3', date: '2024-05-13', day: 'Monday', accountName: 'Utec', contactPerson: 'Harish Vojn',
        contactNumber: '9876543210', workDone: 'Regular Visit and share discuss for new requirements', outcome: 'Positive response, follow-up needed',
        supportRequired: 'Product team for specs',
        remarks: 'Good initiative. Follow up with product team ASAP.'
    },
    {
        id: 'dr2', userId: '2', date: '2024-05-14', day: 'Tuesday', accountName: 'The New Shop', contactPerson: 'Yogesh & Vijay',
        contactNumber: '9988776655', workDone: 'Initial meeting', outcome: 'Scheduled a demo for next week',
        supportRequired: '',
        remarks: ''
    }
];

export const mockWeeklyPlans: WeeklyPlan[] = [
    {
        id: 'wp1', userId: '4', date: '2024-06-24', day: 'Monday', customerName: 'NR - DELHI / AMBALA', contactPerson: 'CRS',
        requirement: 'ATVM TESTING, FOLLOWUP FOR PAYMENT OF 99 TC', proposedAction: 'WORKING WITH FREE LANCERS FOR FURTHER TESTING',
        planningRequired: '', supportRequired: 'MANISH (B2B)',
        remarks: 'Coordinate with Manish to ensure alignment.'
    },
    {
        id: 'wp2', userId: '3', date: '2024-06-25', day: 'Tuesday', customerName: 'DDRM - DEHRADUN', contactPerson: 'GAURI MA\'AM',
        requirement: 'SOFTWARE TRAINING', proposedAction: 'VISITING DDRM DEHRADUN FOR TRAINING AND HANDOVER OF THE SOFTWARE AND PAYMENT COLLECTION',
        planningRequired: '', supportRequired: 'DEEN DAYAL',
        remarks: ''
    },
     {
        id: 'wp3', userId: '2', date: '2024-07-01', day: 'MONDAY', customerName: 'NR - DELHI / AMBALA', contactPerson: 'CRS',
        requirement: 'ATVM TESTING, FOLLOWUP FOR PAYMENT OF 99 TC', proposedAction: 'WORKING WITH FREE LANCERS FOR FURTHER TESTING',
        planningRequired: '', supportRequired: '',
        remarks: 'Please provide a status update by EOD Friday.'
    }
];

export let mockPermissions: Permission[] = [
  // Gulshan can view Yaspal's reports
  { viewerId: '2', targetId: '3' },
];