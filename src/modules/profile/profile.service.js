export default class ProfileService {
    constructor(ProfileRepository) {
        this.ProfileRepository = ProfileRepository;
    }

    // return UserProfile information if the user is the same and found
    async getUserProfileInfo(userId) {
        try {
            const userProfile = await this.ProfileRepository.getUserProfile(userId);
            if (!userProfile) { throw Error('NOT_FOUND'); }
            return userProfile;
        } catch (err) {
            throw Error(err);
        }
    }

    // Delete UserInformation in case user wants to delete the account (so both Profile and User data are removed)
    async deleteProfileInfo(userId) {
        try {
            const profileInfo = await this.ProfileRepository.getUserProfile(userId);
            if (!profileInfo) {
                throw Error('NOT_FOUND');
            }
            if (userId != profileInfo.user) {
                throw Error('Unauthorized operations');
            }
            return await this.ProfileRepository.deleteProfileInfo(userId);

        } catch (err) {
            throw Error(err);
        }
    }

    // Update Profile info
    async updateProfileInfo(userId, updates) {
        try {
            const profileInfo = await this.ProfileRepository.getUserProfile(userId);
            if (!profileInfo) {
                throw Error('NOT_FOUND');
            }
            if (userId != profileInfo.user) {
                throw Error('Unauthorized operations');
            }
            return await this.ProfileRepository.updateProfileInfo(userId, updates);

        } catch (err) {
            throw Error(err);
        }
    }
}
