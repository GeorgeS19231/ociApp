import { AppError } from '../../utils/app_error.js';

export default class ProfileService {
    constructor(ProfileRepository) {
        this.ProfileRepository = ProfileRepository;
    }

    // return UserProfile information if the user is the same and found
    async getUserProfileInfo(userId) {
        try {
            const userProfile = await this.ProfileRepository.getUserProfile(userId);
            if (!userProfile) {
                throw new AppError(404, 'User profile not found');
            }

            return userProfile;
        } catch (err) {
            throw err;
        }
    }

    // Delete UserInformation in case user wants to delete the account (so both Profile and User data are removed)
    async deleteProfileInfo(userId) {
        try {
            const profileInfo = await this.ProfileRepository.getUserProfile(userId);
            if (!profileInfo) {
                throw new AppError(404, 'User profile not found');
            }

            if (String(userId) !== String(profileInfo.user)) {
                throw new AppError(403, 'Unauthorized operations');
            }

            return await this.ProfileRepository.deleteProfileInfo(userId);

        } catch (err) {
            throw err;
        }
    }

    // Update Profile info
    async updateProfileInfo(userId, updates) {
        try {
            const profileInfo = await this.ProfileRepository.getUserProfile(userId);
            if (!profileInfo) {
                throw new AppError(404, 'User profile not found');
            }

            if (String(userId) !== String(profileInfo.user)) {
                throw new AppError(403, 'Unauthorized operations');
            }

            return await this.ProfileRepository.updateProfileInfo(userId, updates);

        } catch (err) {
            throw err;
        }
    }
}
