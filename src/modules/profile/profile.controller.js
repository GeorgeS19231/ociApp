export default class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }

    getUserProfileInfo = async (req, res, next) => {
        try {
            const profile = await this.profileService.getUserProfileInfo(req.user._id);
            return res.json({ profile });

        } catch (err) {
            return next(err);
        }
    };

    deleteProfileInfo = async (req, res, next) => {
        try {
            const result = await this.profileService.deleteProfileInfo(req.user._id);
            return res.json({ result });
        } catch (err) {
            return next(err);
        }
    };

    updateProfileInfo = async (req, res, next) => {
        try {
            const body = req.body;
            if (!body) {
                return res.status(400).json({
                    error: 'updating profile needs a body',
                    code: 'PROFILE_UPDATE_FAIL_MISSING_BODY'
                });
            }
            const profile = await this.profileService.updateProfileInfo(req.user._id, body);
            return res.json({ profile });

        } catch (err) {
            return next(err);
        }
    };
}
