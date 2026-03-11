import express from 'express';
import { auth } from '../middleware/auth.js';
import { checkAccountActivation } from '../middleware/account_activation.js';
import userModule from '../modules/user/user.module.js';

export const userRouter = express.Router();
const { controller } = userModule;

userRouter.get('/user/me', auth, controller.getCurrentUser);
userRouter.post('/user/register', controller.register);
userRouter.post('/user/verify-email', checkAccountActivation, controller.verifyEmail);
userRouter.post('/user/login', controller.login);
userRouter.post('/user/refresh-token', controller.refreshToken);

userRouter.post('/user/forgot-password', controller.forgotPassword);
userRouter.post('/user/reset-password', controller.resetPassword);
userRouter.post('/user/send-verification', controller.sendVerification);
userRouter.post('/user/update-profile-avatar', auth, controller.updateProfileAvatar);
userRouter.patch('/user/update-info', auth, controller.updateInfo);
userRouter.post('/user/logout', auth, controller.logout);
userRouter.post('/user/logout-all', auth, controller.logoutAll);
userRouter.delete('/user/delete', auth, controller.deleteUser);
