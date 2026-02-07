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
                    code: 'NO_BODY_FOUND'
                });
            }
            return await this.cvService.createNewCv(data);

        } catch (err) {
            return next(err);
        }
    }
}