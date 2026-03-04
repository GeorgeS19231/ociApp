export default class JobService {
    constructor(JobRepository, ProfileRepository) {
        this.JobRepository = JobRepository;
        this.ProfileRepository = ProfileRepository;
    }
    async createJob(jobData) {
        try {
            if (!jobData) {
                throw new Error('Job data is required to create a job');
            }
            const userProfile = await this.ProfileRepository.getUserProfile(jobData.author);
            if (!userProfile) {
                throw new Error('User profile not found. Please complete your profile before creating a job post.');
            }
            if (userProfile.isRecruiter === false) {
                throw new Error('Only recruiters can create job posts.');
            }
            return await this.JobRepository.createJob(jobData);
        }
        catch (err) {
            throw Error(err);
        }

    }

    async deleteJob(jobId, authorId) {
        try {
            const job = await this.JobRepository.checkJobOwnership(jobId, authorId);
            if (!job) { throw new Error('You are not authorized to delete this job') }
            return await this.JobRepository.deleteJob(jobId)
        }
        catch (err) {
            throw Error(err);
        }
    }
    async getJobList(filter, skip, limit, sort) {
        try {
            return await this.JobRepository.getJobList(filter, skip, limit, sort);
        } catch (err) {
            throw Error(err);
        }
    }
}