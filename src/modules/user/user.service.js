import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/app_error.js';

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
            throw new AppError(403, 'Please verify your email before logging in.');
        }

        const { accessToken, refreshToken } = await user.generateAuthTokens();
        return { user, accessToken, refreshToken };
    }

    async refreshAuthToken(refreshToken) {
        if (!refreshToken) {
            throw new AppError(400, 'Refresh token required');
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
            throw new AppError(401, 'Invalid refresh token');
        }

        await user.cleanupExpiredTokens();

        const tokenData = user.refreshTokens.find((storedToken) => storedToken.token === refreshToken);
        if (!tokenData || tokenData.expiresAt < new Date()) {
            if (tokenData) {
                user.refreshTokens = user.refreshTokens.filter((storedToken) => storedToken.token !== refreshToken);
                await this.userRepository.save(user);
            }

            throw new AppError(401, 'Refresh token expired');
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
            throw new AppError(400, 'Update body is required');
        }

        const invalidField = updateKeys.find((key) => !allowedUpdates.includes(key));
        if (invalidField) {
            throw new AppError(400, `Invalid update field: ${invalidField}`);
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
            throw new AppError(400, 'Email is required');
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
            throw new AppError(400, 'Email, reset code and new password are required');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordResetToken.length) {
            throw new AppError(400, 'Invalid or expired reset code');
        }

        const storedToken = user.passwordResetToken[0];
        if (storedToken.expiresAt < new Date()) {
            user.passwordResetToken = [];
            await this.userRepository.save(user);
            throw new AppError(400, 'Invalid or expired reset code');
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
            throw new AppError(400, 'Invalid or expired reset code');
        }

        user.password = newPassword;
        user.passwordResetToken = [];
        await this.userRepository.save(user);
        return { message: 'Password has been reset' };
    }

    async sendVerification(email) {
        if (!email) {
            throw new AppError(400, 'Email is required');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError(404, 'User not found');
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
            throw new AppError(400, 'avatarUrl is required');
        }

        const profile = await this.profileRepository.updateAvatar(userId, avatarUrl);
        if (!profile) {
            throw new AppError(404, 'Profile not found');
        }

        return profile;
    }
}
