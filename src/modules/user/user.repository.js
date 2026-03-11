export default class UserRepository {
    constructor(userModel) {
        this.User = userModel;
    }

    create(userData) {
        return new this.User(userData);
    }

    findByCredentials(email, password) {
        return this.User.findByCredentials(email, password);
    }

    findByEmail(email) {
        return this.User.findOne({ email });
    }

    findByIdAndRefreshToken(userId, refreshToken) {
        return this.User.findOne({
            _id: userId,
            'refreshTokens.token': refreshToken
        });
    }

    async save(user) {
        await user.save();
        return user;
    }

    delete(user) {
        return user.deleteOne();
    }
}
