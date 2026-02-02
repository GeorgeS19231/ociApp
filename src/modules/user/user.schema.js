import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isAtLeast16 } from "../validators/age_validation.js";
import { customAlphabet } from "nanoid";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator(value) {
                return validator.isEmail(value);
            },
            message: 'Email is invalid'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: {
            validator(value) {
                return value.toLowerCase().includes('password');
            },
            message: 'Password cannot contain "password"'
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        sessionId: {
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
        },
        sessionId: {
            type: String,
            required: true
        }
    }],

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        failedAttempts: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true, transform: (doc, ret) => {
            delete ret.password;
            delete ret.tokens;
            delete ret.refreshTokens;
            delete ret.isVerified;
            delete ret.verificationToken;
            return ret;
        }
    },
    toObject: {
        virtuals: true, transform: (doc, ret) => {
            delete ret.password;
            delete ret.tokens;
            delete ret.refreshTokens;
            delete ret.isVerified;
            delete ret.verificationToken;
            return ret;
        },
    }
});

userSchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'author'
})

userSchema.methods.generateVerificationToken = async function () {
    // Generate random number of 5 characters based on given ones 
    const nanoid = customAlphabet('12345670', 5);
    const randomVerificationCode = nanoid();
    // We'll hash the generated one for an extra security layer
    const encryptedCode = await bcrypt.hash(`${this._id}:${randomVerificationCode}:${process.env.OTP_PEPPER}`, 8);
    this.verificationToken.push({
        token: encryptedCode,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)  // 1 hour
    });
    await this.save();
    return { randomVerificationCode };

}

// Generate both access and refresh tokens
userSchema.methods.generateAuthTokens = async function () {
    // Generate unique session ID to link access token with refresh token
    const sessionId = new mongoose.Types.ObjectId().toString();

    const accessToken = jwt.sign(
        { _id: this._id.toString(), sessionId },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        }
    );

    const refreshToken = jwt.sign(
        { _id: this._id.toString(), type: 'refresh', sessionId },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        {
            expiresIn: '7d',
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        }
    );

    this.tokens.push({
        token: accessToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),  // 1 hour
        sessionId
    });
    this.refreshTokens.push({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days
        sessionId
    });

    await this.save();
    return { accessToken, refreshToken };
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// Clean up expired tokens
userSchema.methods.cleanupExpiredTokens = async function () {
    const now = new Date();

    // Remove expired access tokens
    this.tokens = this.tokens.filter(t => t.expiresAt > now);

    // Remove expired refresh tokens
    this.refreshTokens = this.refreshTokens.filter(rt => rt.expiresAt > now);

    await this.save();
};

// if the user changes his pasword, we need to hash it again and revoke all tokens
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.tokens = [];
        this.refreshTokens = [];
    }
    next();
});

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this;
    // TODO: Add any cascading deletes for related to user model here
    next();
});

export const User = mongoose.model('User', userSchema);