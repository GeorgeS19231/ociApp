export default class JobController {
    constructor(jobService) {
        this.jobService = jobService;
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

            const job = await this.jobService.createJob({
                ...data,
                author: req.user._id
            });
            return res.status(201).json({ job });

        } catch (err) {
            return next(err);
        }
    };

    deleteJob = async (req, res, next) => {
        try {
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).json({
                    error: 'job id is required',
                    code: 'NO_ID_FOUND'
                });
            }

            const result = await this.jobService.deleteJob(jobId, req.user._id);
            return res.json({ result });

        } catch (err) {
            return next(err);
        }
    };

    getJobList = async (req, res, next) => {
        try {
            const filter = req.query.filter || {};
            const skip = parseInt(req.query.skip) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const sort = req.query.sort || { createdAt: -1 };
            const jobs = await this.jobService.getJobList(filter, skip, limit, sort);
            return res.json({ jobs });

        } catch (err) {
            return next(err);
        }
    };
}
