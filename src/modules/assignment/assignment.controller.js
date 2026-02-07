export default class AssignmentController {
    constructor(assignmentService) {
        this.assignmentService = assignmentService;
    }

    checkExistingAssignment = async (req, res, next) => {
        try {
            const jobId = req.params.jobId;
            if (!jobId) {
                return res.status(400).json({
                    error: 'MISSING_JOB_ID',
                    message: 'jobId is required',
                });
            }

            const userId = req.user._id;
            const assignmentExists = await this.assignmentService.checkExistingAssignment(userId, jobId)
            return res.json({ assignmentExists });
        } catch (err) {
            return next(err);
        }
    }
    createNewAssignment = async (req, res, next) => {
        try {
            const jobId = req.params.jobId;
            if (!jobId) {
                return res.status(400).json({
                    error: 'MISSING_JOB_ID',
                    message: 'jobId is required',
                });
            }
            const resultedAssignment = await this.assignmentService.createAssignment({ ...req.body, user: req.user._id, job: jobId });
            return res.json({ resultedAssignment });

        } catch (err) {
            return next(err);
        }
    }
    getAssignment = async (req, res, next) => {
        try {
            const assignmentId = req.params.assignmentId;
            if (!assignmentId) {
                return res.status(400).json({
                    error: 'MISSING_ASSIGNMENT_ID',
                    message: 'assignmentId is required',
                });
            }
            const assignment = await this.assignmentService.getAssignment(req.user._id, assignmentId);
            return res.json({ assignment })


        } catch (err) {
            return next(err);
        }
    }
    removeAnAssignment = async (req, res, next) => {
        try {
            if (!req.params.assignmentId) {
                return res.status(400).json({
                    error: 'MISSING_ASSIGNMENT_ID',
                    message: 'assignmentId is required'
                });
            }
            const result = await this.assignmentService.removeAssignment(req.user._id, req.params.assignmentId)
            return res.json({ result });
        } catch (err) {
            return next(err);
        }
    }
    changeExistingAssignmentStatus = async (req, res, next) => {
        try {
            const assignmentId = req.params.assignmentId;
            if (!req.params.assignmentId) {
                return res.status(400).json({
                    error: 'MISSING_ASSIGNMENT_ID',
                    message: 'assignmentId is required'
                });
            }
            const newStatus = req.body.status;
            if (!newStatus) {
                return res.status(400).json({
                    error: 'MISSING_STATUS',
                    message: 'status is required for updating status'
                });
            }
            const updatedEntity = await this.assignmentService.changeAssignmentStatus(req.user._id, assignmentId, newStatus);
            return res.json({ updatedEntity });


        } catch (err) {
            return next(err);
        }
    }
    getAssignmentsList = async (req, res, next) => {
        try {
            const { page, limit } = req.query;
            if (!page || !limit) {
                return res.status(400).json({
                    error: 'MISSING_PAGE_OR_LIMIT',
                    message: 'Page and limit are required'
                });
            }
            const jobId = req.params;
            if (!job) {
                return res.status(400).json({
                    error: 'MISSING_JOB_ID',
                    message: 'jobId is required',
                });
            }
            return await this.assignmentService.getAssignmentsList(req.user._id, jobId, page, limit);
        } catch (err) {
            return next(err);
        }
    }
}