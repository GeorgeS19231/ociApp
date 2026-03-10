import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default class UserService {
    constructor(userRepository, profileRepository, mailer) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.mailer = mailer;
    }

    async getCurrentUser(user) {
        return user;
    }

    async register(userData) {
        const user = this.userRepository.create(userData);
        const { randomVerificationCode } = await user.generateVerificationToken();
        await this.mailer.sendActivationCodeToNewUser(user.email, user.email, randomVerificationCode);
        return user;
    }

    async getVerifyEmailResult(verificationSuccess) {
        if (!verificationSuccess) {
            return {
                status: 403,
                body: { error: "User's validation token was deleted" }
            };
        }

        return {
            status: 200,
            body: { message: 'Account successfuly activated' }
        };
    }

    async login(email, password) {
        const user = await this.userRepository.findByCredentials(email, password);

        if (!user.isVerified) {
            const error = new Error('Please verify your email before logging in.');
            error.status = 403;
            throw error;
        }

        const { accessToken, refreshToken } = await user.generateAuthTokens();
        return { user, accessToken, refreshToken };
    }

    async refreshAuthToken(refreshToken) {
        if (!refreshToken) {
            const error = new Error('Refresh token required');
            error.status = 400;
            throw error;
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            {
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE
            }
        );

        const user = await this.userRepository.findByIdAndRefreshToken(decoded._id, refreshToken);
        if (!user) {
            const error = new Error('Invalid refresh token');
            error.status = 401;
            throw error;
        }

        await user.cleanupExpiredTokens();

        const tokenData = user.refreshTokens.find((storedToken) => storedToken.token === refreshToken);
        if (!tokenData || tokenData.expiresAt < new Date()) {
            if (tokenData) {
                user.refreshTokens = user.refreshTokens.filter((storedToken) => storedToken.token !== refreshToken);
                await this.userRepository.save(user);
            }

            const error = new Error('Refresh token expired');
            error.status = 401;
            throw error;
        }

        const { sessionId } = decoded;
        user.tokens = user.tokens.filter((token) => token.sessionId !== sessionId);
        user.refreshTokens = user.refreshTokens.filter((storedToken) => storedToken.token !== refreshToken);
        await this.userRepository.save(user);

        const { accessToken, refreshToken: newRefreshToken } = await user.generateAuthTokens();
        return { accessToken, refreshToken: newRefreshToken };
    }

    async updateInfo(user, updates) {
        const allowedUpdates = ['email', 'password'];
        const updateKeys = Object.keys(updates || {});

        if (!updateKeys.length) {
            const error = new Error('Update body is required');
            error.status = 400;
            throw error;
        }

        const invalidField = updateKeys.find((key) => !allowedUpdates.includes(key));
        if (invalidField) {
            const error = new Error(`Invalid update field: ${invalidField}`);
            error.status = 400;
            throw error;
        }

        for (const key of updateKeys) {
            user[key] = updates[key];
        }

        await this.userRepository.save(user);
        return user;
    }

    async logout(user, currentToken) {
        const tokenEntry = user.tokens.find((token) => token.token === currentToken);
        const sessionId = tokenEntry?.sessionId;

        user.tokens = user.tokens.filter((token) => token.token !== currentToken);
        if (sessionId) {
            user.refreshTokens = user.refreshTokens.filter((token) => token.sessionId !== sessionId);
        }

        await this.userRepository.save(user);
    }

    async logoutAll(user) {
        user.tokens = [];
        user.refreshTokens = [];
        await this.userRepository.save(user);
    }

    async deleteUser(user) {
        await this.mailer.sendByebyeEmail(user.email, user.email);
        await this.userRepository.delete(user);
    }

    async forgotPassword(email) {
        if (!email) {
            const error = new Error('Email is required');
            error.status = 400;
            throw error;
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return { message: 'If the account exists, a reset code was sent' };
        }

        const { resetCode } = await user.generatePasswordResetToken();
        await this.mailer.sendPasswordResetCode(user.email, resetCode);
        return { message: 'If the account exists, a reset code was sent' };
    }

    async resetPassword(email, resetCode, newPassword) {
        if (!email || !resetCode || !newPassword) {
            const error = new Error('Email, reset code and new password are required');
            error.status = 400;
            throw error;
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordResetToken.length) {
            const error = new Error('Invalid or expired reset code');
            error.status = 400;
            throw error;
        }

        const storedToken = user.passwordResetToken[0];
        if (storedToken.expiresAt < new Date()) {
            user.passwordResetToken = [];
            await this.userRepository.save(user);
            const error = new Error('Invalid or expired reset code');
            error.status = 400;
            throw error;
        }

        const isMatch = await bcrypt.compare(
            `${user._id}:${resetCode}:${process.env.OTP_PEPPER}`,
            storedToken.token
        );

        if (!isMatch) {
            storedToken.failedAttempts += 1;
            if (storedToken.failedAttempts >= 3) {
                user.passwordResetToken = [];
            }
            await this.userRepository.save(user);
            const error = new Error('Invalid or expired reset code');
            error.status = 400;
            throw error;
        }

        user.password = newPassword;
        user.passwordResetToken = [];
        await this.userRepository.save(user);
        return { message: 'Password has been reset' };
    }

    async sendVerification(email) {
        if (!email) {
            const error = new Error('Email is required');
            error.status = 400;
            throw error;
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        if (user.isVerified) {
            return { message: 'Account is already verified' };
        }

        const { randomVerificationCode } = await user.generateVerificationToken();
        await this.mailer.sendActivationCodeToNewUser(user.email, user.email, randomVerificationCode);
        return { message: 'Verification email resent' };
    }

    async updateProfileAvatar(userId, avatarUrl) {
        if (!avatarUrl) {
            const error = new Error('avatarUrl is required');
            error.status = 400;
            throw error;
        }

        const profile = await this.profileRepository.updateAvatar(userId, avatarUrl);
        if (!profile) {
            const error = new Error('Profile not found');
            error.status = 404;
            throw error;
        }

        return profile;
    }
}
