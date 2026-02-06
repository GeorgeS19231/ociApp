// Here I'll write application logic, not db logic
import { JobRepository } from './job.repository.js';

export default class JobService {
    async createJob(jobData) {
        return await JobRepository.createJob(jobData);
    }

    async deleteJob(jobId, authorId) {
        const job = await JobRepository.checkJobOwnership(jobId, authorId);
        if (!job) { throw new Error('You are not authorized to delete this job') }
        return await JobRepository.deleteJob(jobId)
    }
    async getJobList(filter, skip, limit, sort) {
        return await JobRepository.getJobList(filter, skip, limit, sort);
    }
}