// Here I'll write a thin adapter between http layer and service layer
import { JobService } from './job.service.js';

export default class JobController {
    constructor(JobService) {
        this.JobService = JobService;
    }
    createJob = async (req, res, next) => {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({
                    error: 'creating job needs a body',
                    code: 'JOB_FAIL_MISSING_BODY'
                });
            }
            return await this.JobService.createJob(data);

        } catch (err) {
            return next(err);
        }
    }

    deleteJob = async (req, res, next) => {
        try {
            const jobId = req.params;
            if (!jobId) {
                return res.status(400).json({
                    error: 'job id is required',
                    code: 'NO_ID_FOUND'
                });
            }
            return await this.JobService.deleteJob(jobId, req.user._id);

        } catch (err) {
            return next(err);
        }
    }

    getJobList = async (req, res, next) => {
        try {
            const filter = req.query.filter || {};
            const skip = parseInt(req.query.skip) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const sort = req.query.sort || { createdAt: -1 };
            return await this.JobService.getJobList(filter, skip, limit, sort);

        } catch (err) {
            return next(err);
        }
    }
}