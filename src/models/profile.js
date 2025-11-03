import mongoose from 'mongoose';
import { AvailabilitySchema } from './profile.js';

const ProfileSchema = new mongoose.Schema({
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

        validator(value) {
            if (validator.isDate(value) && value >= new Date() && !isAtLeast16(dateOfBirth)) {
                throw new Error('Date of birth must be in the past and be at least 16 years');
            }
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
    availability: [AvailabilitySchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },

}, { timestamps: true });

ProfileSchema.index({ city: 1, isOpenToMeet: 1 })

export const Profile = mongoose.model('Profile', ProfileSchema);