import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    profilePicture: {
        type: String,
    },

    avatar: {
        type: Buffer
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    refreshTokens: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    }],

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true, transform: (doc, ret) => {
            delete ret.password;
            delete ret.tokens;
            delete ret.refreshTokens;
            return ret;
        }
    },
    toObject: {
        virtuals: true, transform: (doc, ret) => {
            delete ret.password;
            delete ret.tokens;
            delete ret.refreshTokens;
            delete ret.avatar;
            return ret;
        },
    }
});

// if the user changes his pasword, we need to hash it again and revoke all tokens
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.tokens = [];
        this.refreshTokens = [];
    }
    next();
});

export const User = mongoose.model('User', userSchema);