import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import DailyReport from './models/dailyReportModel.js';
import WeeklyPlan from './models/weeklyPlanModel.js';
import Permission from './models/permissionModel.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

await connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await DailyReport.deleteMany();
        await WeeklyPlan.deleteMany();
        await Permission.deleteMany();

        const createdUsers = await User.insertMany([
            { name: 'Admin', username: 'admin', password: 'admin', role: 'admin' },
            { name: 'Gulshan Kumar', username: 'gulshan', password: 'password', role: 'user' },
            { name: 'Yaspal Singh', username: 'yspal', password: 'password', role: 'user' },
            { name: 'Manish Rawat', username: 'manish', password: 'password', role: 'user' },
        ]);

        const adminUser = createdUsers[0];
        const gulshanUser = createdUsers[1];
        const yaspalUser = createdUsers[2];
        const manishUser = createdUsers[3];

        await DailyReport.insertMany([
            {
                userId: yaspalUser._id, date: new Date('2024-05-13'), day: 'Monday', accountName: 'Utec', contactPerson: 'Harish Vojn',
                contactNumber: '9876543210', workDone: 'Regular Visit and share discuss for new requirements', outcome: 'Positive response, follow-up needed',
                supportRequired: 'Product team for specs',
                remarks: 'Good initiative. Follow up with product team ASAP.'
            },
            {
                userId: gulshanUser._id, date: new Date('2024-05-14'), day: 'Tuesday', accountName: 'The New Shop', contactPerson: 'Yogesh & Vijay',
                contactNumber: '9988776655', workDone: 'Initial meeting', outcome: 'Scheduled a demo for next week',
                supportRequired: '',
                remarks: ''
            }
        ]);

        await WeeklyPlan.insertMany([
             {
                userId: manishUser._id, date: new Date('2024-06-24'), day: 'Monday', customerName: 'NR - DELHI / AMBALA', contactPerson: 'CRS',
                requirement: 'ATVM TESTING, FOLLOWUP FOR PAYMENT OF 99 TC', proposedAction: 'WORKING WITH FREE LANCERS FOR FURTHER TESTING',
                planningRequired: '', supportRequired: 'MANISH (B2B)',
                remarks: 'Coordinate with Manish to ensure alignment.'
            },
            {
                userId: yaspalUser._id, date: new Date('2024-06-25'), day: 'Tuesday', customerName: 'DDRM - DEHRADUN', contactPerson: 'GAURI MA\'AM',
                requirement: 'SOFTWARE TRAINING', proposedAction: 'VISITING DDRM DEHRADUN FOR TRAINING AND HANDOVER OF THE SOFTWARE AND PAYMENT COLLECTION',
                planningRequired: '', supportRequired: 'DEEN DAYAL',
                remarks: ''
            },
             {
                userId: gulshanUser._id, date: new Date('2024-07-01'), day: 'MONDAY', customerName: 'NR - DELHI / AMBALA', contactPerson: 'CRS',
                requirement: 'ATVM TESTING, FOLLOWUP FOR PAYMENT OF 99 TC', proposedAction: 'WORKING WITH FREE LANCERS FOR FURTHER TESTING',
                planningRequired: '', supportRequired: '',
                remarks: 'Please provide a status update by EOD Friday.'
            }
        ]);

        await Permission.create({
            viewerId: gulshanUser._id,
            targetId: yaspalUser._id
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await DailyReport.deleteMany();
        await WeeklyPlan.deleteMany();
        await Permission.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
