export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getCurrentUser = async (req, res, next) => {
        try {
            const user = await this.userService.getCurrentUser(req.user);
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    };

    register = async (req, res, next) => {
        try {
            await this.userService.register(req.body);
            return res.status(201).json({ message: 'User created' });
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    verifyEmail = async (req, res, next) => {
        try {
            const result = await this.userService.getVerifyEmailResult(req.verificationSuccess);
            return res.status(result.status).json(result.body);
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.userService.login(email, password);
            return res.json(result);
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            const tokens = await this.userService.refreshAuthToken(req.body.refreshToken);
            return res.json(tokens);
        } catch (error) {
            error.status ??= 401;
            return next(error);
        }
    };

    forgotPassword = async (req, res, next) => {
        try {
            const result = await this.userService.forgotPassword(req.body.email);
            return res.json(result);
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    resetPassword = async (req, res, next) => {
        try {
            const result = await this.userService.resetPassword(
                req.body.email,
                req.body.resetCode,
                req.body.password
            );
            return res.json(result);
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    sendVerification = async (req, res, next) => {
        try {
            const result = await this.userService.sendVerification(req.body.email);
            return res.json(result);
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    updateProfileAvatar = async (req, res, next) => {
        try {
            const profile = await this.userService.updateProfileAvatar(req.user._id, req.body.avatarUrl);
            return res.json({ profile });
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    updateInfo = async (req, res, next) => {
        try {
            const user = await this.userService.updateInfo(req.user, req.body);
            return res.json({ user });
        } catch (error) {
            error.status ??= 400;
            return next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            await this.userService.logout(req.user, req.token);
            return res.json({ message: 'Logged out successfully' });
        } catch (error) {
            error.status ??= 500;
            return next(error);
        }
    };

    logoutAll = async (req, res, next) => {
        try {
            await this.userService.logoutAll(req.user);
            return res.json({ message: 'Logged out from all devices successfully' });
        } catch (error) {
            error.status ??= 500;
            return next(error);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            await this.userService.deleteUser(req.user);
            return res.json({ message: 'User account deleted successfully' });
        } catch (error) {
            error.status ??= 500;
            return next(error);
        }
    };

}
