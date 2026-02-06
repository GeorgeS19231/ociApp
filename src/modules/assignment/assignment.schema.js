import mongoose from 'mongoose';


const assignmentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true,
    },
    cv: {
        type: mongoose.Schema.ObjectId,
        ref: 'CV',
        required: true,
    },
    status: {
        type: String,
        enum: ['applied', 'hired', 'rejected', 'viewed'],
        default: 'applied',
        required: true,
    }
},
    {
        timestamps: true,
        strict: 'throw',
    }
);

assignmentSchema.index({ user: 1, job: 1 }, { unique: true });
assignmentSchema.index({ job: 1 });

export const Assignment = mongoose.model('Assignment', assignmentSchema);