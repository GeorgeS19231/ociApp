import JobRepository from './job.repository.js';
import JobService from './job.service.js';
import JobController from './job.controller.js';
import ProfileRepository from '../profile/profile.repository.js';
import { Job } from './job.schema.js';
import { Profile } from '../profile/profile.schema.js';

const jobRepository = new JobRepository(Job);
const profileRepository = new ProfileRepository(Profile);
const jobService = new JobService(jobRepository, profileRepository);
const jobController = new JobController(jobService);



export default {
    controller: jobController,
    jobRepository,
    jobService,
    jobController
}
