export default class ProfileController {
    constructor(ProfileService) {
        this.ProfileService = ProfileService;
    }

    getUserPorfileInfo = async (req, res, next) => {
        try {

            return await this.ProfileService.getUserPorfileInfo(req.user._id);

        } catch (err) {
            return next(err);
        }
    }

    deleteProfileInfo = async (req, res, next) => {
        try {
            return await this.ProfileService.deleteProfileInfo(req.user._id);
        } catch (err) {
            return next(err);
        }
    }

    updateProfileInfo = async (req, res, next) => {
        try {
            const body = req.body;
            if (!body) {
                return res.status(400).json({
                    error: 'updating profile needs a body',
                    code: 'PROFILE_UPDATE_FAIL_MISSING_BODY'
                });
            }
            return await this.ProfileService.updateProfileInfo(req.user._id, body);

        } catch (err) {
            return next(err);
        }
    }
}