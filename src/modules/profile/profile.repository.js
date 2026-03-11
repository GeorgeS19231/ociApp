export default class ProfileRepository {
    constructor(ProfileModel, UserModel) {
        this.ProfileModel = ProfileModel;
        this.UserModel = UserModel;
    }

    // Get current user informations
    async getUserProfile(userId) {
        return await this.ProfileModel.findOne({ user: userId });
    }

    // Delete profile information
    async deleteProfileInfo(userId) {
        const deletedProfile = await this.ProfileModel.findOneAndDelete({ user: userId });
        if (!deletedProfile) {
            throw new Error("Profile deletion failed");
        }
        const deletedUser = await this.UserModel.findOneAndDelete({ _id: userId });
        return { deletedProfile, deletedUser };
    }

    // Update the profile
    async updateProfileInfo(userId, updated) {
        return await this.ProfileModel.findOneAndUpdate({ user: userId }, { $set: updated }, { new: true, runValidators: true });
    }

    async updateAvatar(userId, avatarUrl) {
        return await this.ProfileModel.findOneAndUpdate(
            { user: userId },
            { $set: { avatarUrl } },
            { new: true, runValidators: true }
        );
    }

}
