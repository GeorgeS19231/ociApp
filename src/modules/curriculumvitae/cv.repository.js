export default class CvRepository {
    constructor(cvModel) {
        this.cvModel = cvModel;
    }

    // Create new cv for current user
    //    
    async createCv(cvData) {
        return await this.cvModel.create(cvData);
    }

    // Get a specific cv
    //
    async getCv(cvId) {
        return await this.cvModel
            .findById(cvId)
            .populate('user');
    }
    // Update an existing cv for current user
    //
    async updateCv(cvId, cvData) {
        return await this.cvModel.findByIdAndUpdate(
            { _id: cvId },
            cvData,
            { new: true, runValidators: true }
        );
    }

    // Remove a cv for current user
    //
    async removeCV(cvId, userId) {
        return await this.cvModel.findOneAndDelete({ _id: cvId, user: userId });
    }
}
