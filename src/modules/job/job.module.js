import JobRepository from './job.repository.js';
import JobService from './job.service.js';
import JobController from './job.controller.js';
import ProfileRepository from '../profile/profile.repository.js';

const jobRepository = new JobRepository();
const profileRepository = new ProfileRepository();
const jobService = new JobService(jobRepository, profileRepository);
const jobController = new JobController(jobService);



export default {
    jobRepository,
    jobService,
    jobController
}