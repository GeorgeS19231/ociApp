import express from "express";
import profileModule from "../modules/profile/profile.module.js";
import { auth } from "../middleware/auth.js";

export const profileRoute = express.Router();
const { profileController } = profileModule;

// Get current user profile information
//
profileRoute.get('/me', auth, profileController.getUserProfileInfo);

// Delete current user profile information
//
profileRoute.delete('/me', auth, profileController.deleteProfileInfo);

// Update current user profile information
//
profileRoute.patch('/me', auth, profileController.updateProfileInfo);
