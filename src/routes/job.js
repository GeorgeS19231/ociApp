import express from 'express';
import jobModule from '../modules/job/job.module.js';
import { auth } from '../middleware/auth.js';

export const jobRouter = express.Router();
const { controller } = jobModule;

// GET /jobs?city=london&status=open&title=nurse&q=javascript&sortBy=when.startDate&sortOrder=desc&page=1&limit=20
jobRouter.get('/jobs', auth, controller.getJobList);

// POST /jobs
jobRouter.post('/jobs', auth, controller.createJob);

// DELETE /jobs/:jobId
jobRouter.delete('/jobs/:jobId', auth, controller.deleteJob);