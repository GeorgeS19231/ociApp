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
    }
},
    { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);