// Here I'll encapsulate all the db operations related with the job posts

export default class JobRepository {
    constructor(JobModel) {
        this.Job = JobModel;
    }

    async createJob(jobData) {
        const job = new this.Job(jobData);
        return await job.save();
    }

    async checkJobOwnership(jobId, authorId) {
        return await this.Job.findOne({ _id: jobId, author: authorId });
    }

    async deleteJob(jobId) {
        return await this.Job.deleteOne({ _id: jobId });
    }

    async getJobById(jobId) {
        return await this.Job.findById(jobId);
    }
    async getJobList(filter, skip, limit, sort) {
        return await this.Job.find(filter, '_id title city salaryRange when')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
}

}