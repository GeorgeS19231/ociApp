
export default class AssignmentRepository {
    constructor(AssignmentModel) {
        this.Assignment = AssignmentModel;
    }

    // Check if there's already an assignmet from a user for a job
    async checkIfAssignmentExistForJob(userId, jobId){
        return await this.Assignment.findOne({user: userId, job: jobId});
    }

    // Check the existence of a specific assignemnent
    async checkIfAssignmentExist(userId, assignmentId){
        return await this.Assignment.findOne({user: userId, _id: assignmentId});
    }


    // To create a new assignment
    async createAssignment(assignment) {
        return await this.Assignment.create(assignment);
    }

    async getAssignmentWithAuthor(assignmentId){
        return await this.Assignment.findById(assignmentId).populate('job', 'author').lean();
    }

    // To remove all assignments of a job after that one was deleted
    async removeAssignments(jobId) {
        return await this.Assignment.deleteMany({ job: jobId });
    }

    // Remove an assignmet for a job
    async removeAssignment(assignmentId) {
        return await this.Assignment.deleteOne({ _id: assignmentId });
    }


    // Update the status for an assignment
    async changeAssignmentStatus(assignmentId, status) {
        return await this.Assignment.findOneAndUpdate(
            { _id: assignmentId },
            { $set: { status } },
            { new: true, runValidators: true }
        ).lean();
    }

}