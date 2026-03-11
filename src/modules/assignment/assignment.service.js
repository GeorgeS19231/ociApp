import { AppError } from '../../utils/app_error.js';

export default class AssignmentService {
    constructor(assignmentRepo, jobRepo) {
        this.assignmentRepo = assignmentRepo;
        this.jobRepo = jobRepo;
    }

    async checkExistingAssignment(userId, jobId) {
        try {
            const result = await this.assignmentRepo.checkIfAssignmentExistForJob(userId, jobId);
            return result !== null;
        } catch (err) {
            throw err;
        }
    }

    async createAssignment(assignment) {
        try {
            // Check if an assignment from this user to this job already exists
            const existingAssignment = await this.assignmentRepo.checkIfAssignmentExistForJob(assignment.user, assignment.job);

            // Throw an error if the check confirms
            if (existingAssignment !== null) {
                throw new AppError(409, 'There`s already an existing assignment for this job');
            }

            return await this.assignmentRepo.createAssignment(assignment);
        } catch (err) {
            throw err;
        }
    }

    async getAssignment(userId, assignmentId) {
        try {
            const requestedAssignment = await this.assignmentRepo.getAssignmentWithAuthor(assignmentId);
            if (!requestedAssignment) {
                throw new AppError(404, 'Assignment not found');
            }

            if (String(userId) !== String(requestedAssignment.user) && String(userId) !== String(requestedAssignment.job.author)) {
                throw new AppError(403, 'Not authorized to access this assignment');
            }

            return requestedAssignment;
        } catch (err) {
            throw err;
        }
    }

    // When a job is filled or removed, we have to remove its assignments 
    async removeJobAssignemnts(userId, jobId) {
        try {
            const authorizedTransaction = await this.jobRepo.checkJobOwnership(jobId, userId);
            if (!authorizedTransaction) {
                throw new AppError(403, 'Not authorized to remove assignments for this job');
            }

            return await this.assignmentRepo.removeAssignments(jobId);
        } catch (err) {
            throw err;
        }
    }

    async removeAssignment(userId, assignmentId) {
        try {
            const getUserAssignmentForJob = await this.assignmentRepo.checkIfAssignmentExist(userId, assignmentId);
            // If we can't find that assignment it means either it doesn't exist or belong to this user

            if (!getUserAssignmentForJob) {
                throw new AppError(403, 'Not authorized to delete this assignment');
            }

            return await this.assignmentRepo.removeAssignment(assignmentId);
        } catch (err) {
            throw err;
        }
    }

    async changeAssignmentStatus(userId, assignmentId, newStatus) {
        try {
            const userAssignment = await this.assignmentRepo.getAssignmentWithAuthor(assignmentId);
            if (userAssignment === null || String(userAssignment.job.author) !== String(userId)) {
                throw new AppError(403, 'There`s no assignment to be changed');
            }

            return await this.assignmentRepo.changeAssignmentStatus(assignmentId, newStatus);
        } catch (err) {
            throw err;
        }
    }

    async getAssignmentsList(userId, jobId, page, limit) {
        try {
            const skip = (page - 1) * limit;
            return await this.assignmentRepo.getAssignmentListForJobAndAuthor(userId, jobId, skip, limit);

        } catch (err) {
            throw err;
        }
    }
}
