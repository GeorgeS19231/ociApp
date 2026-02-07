export default class AssignmentService {
    constructor(assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
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
            if (existingAssignment !== null) throw Error('There`s already an existing assignment for this job');

            return await this.assignmentRepo.createAssignment(assignment);
        } catch (err) {
            throw err;
        }
    }

    async getAssignment(userId, assignmentId) {
        try {

            const requestedAssignment = await this.assignmentRepo.getAssignmentWithAuthor(assignmentId);
            if (String(userId) !== String(requestedAssignment.user) && String(userId) !== String(requestedAssignment.job.author)) {
                throw Error('FORBIDDEN');
            }
            return requestedAssignment;
        } catch (err) {
            throw err;
        }
    }

    // When a job is filled or removed, we have to remove its assignments 
    async removeJobAssignemnts(userProfile, job) {
        try {
            // TODO: check if user is recruiter or not, then identify the job that was deleted
            // then delete the assignments related to that job id

        } catch (err) {
            throw err;
        }
    }

    async removeAssignment(userId, assignmentId) {
        try {
            const getUserAssignmentForJob = await this.assignmentRepo.checkIfAssignmentExist(userId, assignmentId);
            // If we can't find that assignment it means either it doesn't exist or belong to this user
            if (!getUserAssignmentForJob) throw Error('User can`t delete that assignmet');
            return await this.assignmentRepo.removeAssignment(assignmentId);
        } catch (err) {
            throw err;
        }
    }

    async changeAssignmentStatus(userId, assignmentId, newStatus) {
        try {

            const userAssignment = await this.assignmentRepo.getAssignmentWithAuthor(assignmentId);
            if (userAssignment === null || String(userAssignment.job.author) !== String(userId)) throw Error('There`s no assignment to be changed')
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