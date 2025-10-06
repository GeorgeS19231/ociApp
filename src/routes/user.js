import express from 'express';

export const userRouter = express.Router();


userRouter.get('/users/me', auth, async (req, res) => {
    // Assuming `auth` middleware sets req.user
    res.json(req.user);
});

userRouter.post('/users/register', async (req, res) => {
    // Registration logic here
    res.send('User registered');
});

userRouter.post('/users/verify-email', async (req, res) => {
    // Email verification logic here
    res.send('Email verified');
});

userRouter.post('/users/login', async (req, res) => {
    // Login logic here
    res.send('User logged in');
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

userRouter.post('/users/update-profile-avatar', auth, avatarPic, async (req, res) => {
    // Profile update logic here
    res.send('User profile updated');
});

userRouter.patch('/users/update-info', auth, async (req, res) => {
    // Password update logic here
    res.send('User password updated');
});


userRouter.post('/users/logout', auth, async(req, res) => {
    // Logout logic here
    res.send('User logged out');
});

userRouter.delete('/users/delete', auth, async (req, res) => {
    // Account deletion logic here
    res.send('User account deleted');
});