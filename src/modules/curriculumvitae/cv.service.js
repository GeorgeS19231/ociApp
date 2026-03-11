import { AppError } from '../../utils/app_error.js';

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
            throw err;
        }
    }

    // Get a cv
    //
    async getCv(userId, cvId) {
        try {
            const requestedCv = await this.cvRepo.getCv(cvId);

            if (!requestedCv) {
                throw new AppError(404, 'CV not found');
            }

            const isOwner = String(userId) === String(requestedCv.user._id);
            if (isOwner) {
                return requestedCv;
            }

            const assignments = await this.assignmentRepo.getAssignmentsByCvWithJobAuthor(cvId);
            const isJobAuthor = assignments.some((assignment) =>
                assignment.job && String(assignment.job.author) === String(userId)
            );

            if (!isJobAuthor) {
                throw new AppError(403, 'Unauthorized');
            }

            return requestedCv;
        } catch (err) {
            throw err;
        }
    }

    // Update existing cv
    //
    async updateCv(userId, cvId, data) {
        try {
            const userCv = await this.cvRepo.getCv(cvId);
            if (!userCv) {
                throw new AppError(404, 'CV not found');
            }

            if (String(userId) !== String(userCv.user._id)) {
                throw new AppError(403, 'Unauthorized');
            }

            return await this.cvRepo.updateCv(cvId, data);

        } catch (err) {
            throw err;
        }
    }

    // Remove existing cv
    //
    async removeCv(userId, cvId) {
        try {
            const removedCv = await this.cvRepo.removeCv(cvId, userId);
            if (!removedCv) {
                throw new AppError(404, 'CV not found');
            }

            return removedCv;

        } catch (err) {
            throw err;
        }
    }

}
