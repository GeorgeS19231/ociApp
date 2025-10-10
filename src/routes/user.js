import express from 'express';
import { User } from '../models/user.js';
import { auth } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { sendActivationCodeToNewUser } from '../email/account_welcome.js';
import { checkAccountActivation } from '../middleware/account_activation.js';

export const userRouter = express.Router();


userRouter.get('/users/me', auth, async (req, res) => {
    // Assuming `auth` middleware sets req.user
    res.json(req.user);
});

userRouter.post('/users/register', async (req, res) => {
    try {
        const user = new User(req.body);
        const verificationToken = await user.generateVerificationToken();
        sendActivationCodeToNewUser(user.firstName, user.email, verificationToken);
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

userRouter.post('/users/verify-email', checkAccountActivation, async (req, res) => {
    try {
        if (!req.verificationSuccess) {
            res.status(403).send(`User's validation token was deleted`);
        } else {
            res.status(200).send('Account successfuly activated')
        }

    } catch (error) {
        res.status(400).send({ error: error.message });
    }

});

userRouter.post('/users/login', auth, async (req, res) => {
    try {
        const { accessToken, refreshToken } = await req.user.generateAuthTokens();

        res.json({ user: req.user, accessToken, refreshToken });
    } catch (error) {
        res.status(400).send({ error: 'Unable to login' });
    }
});

userRouter.post('/users/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ error: 'Refresh token required' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            {
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE
            }
        );

        // Find user with this refresh token
        const user = await User.findOne({
            _id: decoded._id,
            'refreshTokens.token': refreshToken
        });

        if (!user) {
            return res.status(401).send({ error: 'Invalid refresh token' });
        }

        // Clean up expired tokens first
        await user.cleanupExpiredTokens();

        // Check if refresh token is expired
        const tokenData = user.refreshTokens.find(rt => rt.token === refreshToken);
        if (!tokenData || tokenData.expiresAt < new Date()) {
            // Remove expired token if it exists
            if (tokenData) {
                user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
                await user.save();
            }
            return res.status(401).send({ error: 'Refresh token expired' });
        }

        // Get the sessionId from the refresh token
        const sessionId = decoded.sessionId;

        // Remove old access token with matching sessionId
        user.tokens = user.tokens.filter(t => t.sessionId !== sessionId);

        // Remove the old refresh token
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
        await user.save();

        // Generate new token pair (with same session concept but new sessionId)
        const { accessToken, refreshToken: newRefreshToken } = await user.generateAuthTokens();

        res.send({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).send({ error: 'Invalid refresh token' });
    }
});

userRouter.post('/users/forgot-password', async (req, res) => {
    // Password reset logic here
    res.send('Password reset link sent');
});

userRouter.post('/users/reset-password', async (req, res) => {
    // Password update logic here
    res.send('Password has been reset');
});

userRouter.post('/users/send-verification', async (req, res) => {
    try {

    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
    res.send('Verification email resent');
});

userRouter.post('/users/update-profile-avatar', auth, async (req, res) => {
    // Profile update logic here (add multer middleware later if needed for file upload)
    res.send('User profile updated');
});

userRouter.patch('/users/update-info', auth, async (req, res) => {
    // Password update logic here
    res.send('User password updated');
});


userRouter.post('/users/logout', auth, async (req, res) => {
    try {
        // Find the sessionId of the current access token
        const currentToken = req.user.tokens.find(t => t.token === req.token);
        const sessionId = currentToken?.sessionId;

        // Remove the current access token
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

        // Also remove the corresponding refresh token with the same sessionId
        if (sessionId) {
            req.user.refreshTokens = req.user.refreshTokens.filter(rt => rt.sessionId !== sessionId);
        }

        await req.user.save();
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Logout failed' });
    }
});

userRouter.post('/users/logout-all', auth, async (req, res) => {
    try {
        // Remove all tokens and refresh tokens (logout from all devices)
        req.user.tokens = [];
        req.user.refreshTokens = [];

        await req.user.save();
        res.send({ message: 'Logged out from all devices successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Logout failed' });
    }
});

userRouter.delete('/users/delete', auth, async (req, res) => {
    // Account deletion logic here
    res.send('User account deleted');
});