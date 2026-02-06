import express from 'express';
import assignmentModule from '../modules/assignment/assignment.module.js';
import { auth } from '../middleware/auth.js';

export const assignmentRoute = express.Router();
const { controller } = assignmentModule;

// Check if there's an existing assignment to a job from current user
//
assignmentRoute.get('/jobs/:jobId/assignments', auth, controller.checkExistingAssignment);

// Create a new assigmnet for a job
//
assignmentRoute.post('/jobs/:jobId/assignments', auth, controller.createNewAssignment);

// Get an assignment for a specific job
//
assignmentRoute.get('/jobs/assignments/:assignmentId', auth, controller.getAssignment);

// Remove an assigmnet to a job
//
assignmentRoute.delete('/jobs/assignments/:assignmentId', auth, controller.removeAnAssignment);

// Change the status for a specific assignmnent
//
assignmentRoute.patch('/jobs/assignments/:assignmentId/status', auth, controller.changeExistingAssignmentStatus);