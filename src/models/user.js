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

    verificationCode: {
        type: String
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