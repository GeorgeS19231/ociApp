import mongoose from 'mongoose';
import { AvailabilitySchema } from './profile.schema.js';

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    surrname: {
        type: String,
        required: true,
        trim: true
    },

    bio: {
        type: String,
        trim: true,
        maxLength: 300
    },

    city: {
        type: String,
        trim: true, lowercase:
            true,
        index: true
    },

    dob: {
        type: Date,
        required: true,
        validate: {
            validator(value) {
                if (!(value instanceof Date) || Number.isNaN(value.getTime()))
                    return isAtLeast16(value);

            },
            message: 'Date of birth must be in the past and at least 16 years old'
        }
    },

    sex: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },

    interests: [{
        type: String,
        trim: true, lowercase: true,
        index: true
    }],

    skills: [{
        type: String,
        trim: true, lowercase: true,
        index: true
    }],

    isOpenToMeet: {
        type: Boolean,
        default: true,
        index: true
    },

    avatarUrl: {
        type: String,
        trim: true
    },
    isRecruiter: {
        type: Boolean,
        default: false,

    },
    availability: [AvailabilitySchema],
    favoriteJobs: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Job'
        }
    ]

}, { timestamps: true });

ProfileSchema.index({ city: 1, isOpenToMeet: 1 })

export const Profile = mongoose.model('Profile', ProfileSchema);