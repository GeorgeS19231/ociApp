import express from "express";
import profileModule from "../modules/profile/profile.module.js";
import { auth } from "../middleware/auth.js";

export const profileRoute = express.Router();
const { controller } = profileModule;

// Get current user profile information
//
profileRoute.get('/me', auth, controller.getUserPorfileInfo);

// Delete current user profile information
//
profileRoute.delete('/me', auth, controller.deleteProfileInfo);

// Update current user profile information
//
profileRoute.patch('/me', auth, controller.updateProfileInfo);