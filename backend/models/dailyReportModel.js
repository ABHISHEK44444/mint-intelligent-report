import mongoose from 'mongoose';

const dailyReportSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, required: true },
    day: { type: String, required: true },
    accountName: { type: String, required: true },
    contactPerson: { type: String },
    contactNumber: { type: String },
    workDone: { type: String, required: true },
    outcome: { type: String },
    supportRequired: { type: String },
    remarks: { type: String },
}, { 
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

export default DailyReport;
