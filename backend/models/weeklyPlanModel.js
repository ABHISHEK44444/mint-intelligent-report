import mongoose from 'mongoose';

const weeklyPlanSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, required: true },
    day: { type: String, required: true },
    customerName: { type: String, required: true },
    contactPerson: { type: String },
    requirement: { type: String, required: true },
    proposedAction: { type: String },
    planningRequired: { type: String },
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

const WeeklyPlan = mongoose.model('WeeklyPlan', weeklyPlanSchema);

export default WeeklyPlan;
