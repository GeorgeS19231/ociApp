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

            const cv = await this.cvService.createNewCv({ ...data, user: req.user._id });
            return res.status(201).json({ cv });

        } catch (err) {
            err.status ??= 400;
            return next(err);
        }
    };

    getCv = async (req, res, next) => {
        try {
            const cvId = req.params.id;
            if (!cvId) {
                return res.status(400).json({
                    error: 'cv id is required',
                    code: 'NO_ID_FOUND'
                });
            }

            const cv = await this.cvService.getCv(req.user._id, cvId);
            return res.status(200).json({ cv });

        } catch (err) {
            err.status ??= 400;
            return next(err);
        }
    };

    updateCv = async (req, res, next) => {
        try {
            const cvId = req.params.id;
            if (!cvId) {
                return res.status(400).json({
                    error: 'cv id is required',
                    code: 'NO_ID_FOUND'
                });
            }
            const body = req.body;
            if (!body || !Object.keys(body).length) {
                return res.status(400).json({
                    error: 'updating cv needs a body',
                    code: 'CV_UPDATE_FAIL_MISSING_BODY'
                });
            }

            const cv = await this.cvService.updateCv(req.user._id, cvId, body);
            return res.status(200).json({ cv });

        } catch (err) {
            err.status ??= 400;
            return next(err);
        }
    };

    removeCv = async (req, res, next) => {
        try {
            const cvId = req.params.id;
            if (!cvId) {
                return res.status(400).json({
                    error: 'cv id is required',
                    code: 'NO_ID_FOUND'
                });
            }

            const result = await this.cvService.removeCv(req.user._id, cvId);
            return res.status(200).json({ result });

        } catch (err) {
            err.status ??= 400;
            return next(err);
        }
    };

}
