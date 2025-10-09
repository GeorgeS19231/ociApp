import express from 'express';
import { User } from '../models/user.js';
import { auth } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

export const userRouter = express.Router();


userRouter.get('/users/me', auth, async (req, res) => {
    // Assuming `auth` middleware sets req.user
    res.json(req.user);
});

userRouter.post('/users/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const { accessToken, refreshToken } = await user.generateAuthTokens();
        
        res.status(201).send({ user, accessToken, refreshToken });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

userRouter.post('/users/verify-email', async (req, res) => {
    // Email verification logic here
    res.send('Email verified');
});

userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const { accessToken, refreshToken } = await user.generateAuthTokens();
        
        res.send({ user, accessToken, refreshToken });
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
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );
        
        // Find user with this refresh token
        const user = await User.findOne({ 
            _id: decoded._id, 
            'refreshTokens.token': refreshToken 
        });
        
        if (!user) {
            return res.status(401).send({ error: 'Invalid refresh token' });
        }
        
        // Check if refresh token is expired
        const tokenData = user.refreshTokens.find(rt => rt.token === refreshToken);
        if (tokenData.expiresAt < new Date()) {
            // Remove expired token
            user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
            await user.save();
            return res.status(401).send({ error: 'Refresh token expired' });
        }
        
        // Generate new token pair
        const { accessToken, refreshToken: newRefreshToken } = await user.generateAuthTokens();
        
        // Remove the old refresh token
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
        await user.save();
        
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

userRouter.post('/users/resend-verification', async (req, res) => {
    // Resend verification email logic here
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
        // Remove the current access token
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        
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