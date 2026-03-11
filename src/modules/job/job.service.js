import { AppError } from '../../utils/app_error.js';

export default class JobService {
    constructor(JobRepository, ProfileRepository) {
        this.JobRepository = JobRepository;
        this.ProfileRepository = ProfileRepository;
    }

    async createJob(jobData) {
        try {
            if (!jobData) {
                throw new AppError(400, 'Job data is required to create a job');
            }

            const userProfile = await this.ProfileRepository.getUserProfile(jobData.author);
            if (!userProfile) {
                throw new AppError(404, 'User profile not found. Please complete your profile before creating a job post.');
            }

            if (userProfile.isRecruiter === false) {
                throw new AppError(400, 'Only recruiters can create job posts.');
            }

            return await this.JobRepository.createJob(jobData);
        }
        catch (err) {
            throw err;
        }
    }

    async deleteJob(jobId, authorId) {
        try {
            const job = await this.JobRepository.checkJobOwnership(jobId, authorId);
            if (!job) {
                throw new AppError(403, 'You are not authorized to delete this job');
            }

            return await this.JobRepository.deleteJob(jobId);
        }
        catch (err) {
            throw err;
        }
    }

    async getJobList(filter, skip, limit, sort) {
        try {
            return await this.JobRepository.getJobList(filter, skip, limit, sort);
        } catch (err) {
            throw err;
        }
    }
}
