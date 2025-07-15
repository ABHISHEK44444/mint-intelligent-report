import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
    viewerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
    timestamps: true,
});

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
