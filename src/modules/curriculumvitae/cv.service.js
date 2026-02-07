export default class CvService {
    constructor(cvRepo, assignmentRepo = null) {
        this.cvRepo = cvRepo;
        this.assignmentRepo = assignmentRepo;
    }

    // Create new cv
    //
    async createNewCv(data) {
        try {
            return await this.cvRepo.createCv(data);
        } catch (err) {
            throw Error(err);
        }
    }

    // Get a cv
    async getCv(userId, cvId) {
        try {
            const requestedCv = await this.cvRepo.getCv(cvId);
            if (!requestedCv) throw Error('NOT_FOUND');

            const isOwner = String(userId) === String(requestedCv.user._id);
            if (isOwner) return requestedCv;

            const assignments = await this.assignmentRepo.getAssignmentsByCvWithJobAuthor(cvId);
            const isJobAuthor = assignments.some((assignment) =>
                assignment.job && String(assignment.job.author) === String(userId)
            );

            if (!isJobAuthor) throw Error('FORBIDDEN');
            return requestedCv;
        } catch (err) {
            throw Error(err);
        }
    }
}
