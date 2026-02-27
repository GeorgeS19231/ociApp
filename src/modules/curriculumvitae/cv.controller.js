export default class CvController {
    constructor(cvService) {
        this.cvService = cvService;
    };

    createNewCv = async (req, res, next) => {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({
                    error: 'creating cv needs a body',
                    code: 'CV_FAIL_MISSING_BODY'
                });
            }
            return await this.cvService.createNewCv(data);

        } catch (err) {
            return next(err);
        }
    }

    getCv = async (req, res, next) => {
        try {
            const cvId = req.params;
            if (!cvId) {
                return res.status(400).json({
                    error: 'cv id is required',
                    code: 'NO_ID_FOUND'
                });
            }
            return await this.cvService.getCv(req.user._id, cvId);

        } catch (err) {
            return next(err);
        }
    }
    updateCv = async (req, res, next) => {
        try {
            const cvId = req.params;
            if (!cvId) {
                return res.status(400).json({
                    error: 'cv id is required',
                    code: 'NO_ID_FOUND'
                });
            }
            const body = req.body;
            if (!cvId) {
                return res.status(400).json({
                    error: 'updating cv needs a body',
                    code: 'CV_UPDATE_FAIL_MISSING_BODY'
                });
            }
            return await this.cvService.getCv(req.user._id, cvId);

        } catch (err) {
            return next(err);
        }
    }

    removeCv = async (req, res, next) => {
        try {
            const cvId = req.params;
            if (!cvId) {
                return res.status(400).json({
                    error: 'cv id is required',
                    code: 'NO_ID_FOUND'
                });
            }
            return await this.cvService.removeCv(req.user._id, cvId);

        } catch (err) {
            return next(err);
        }
    }

}