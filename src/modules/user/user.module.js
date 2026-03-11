import UserRepository from './user.repository.js';
import UserService from './user.service.js';
import UserController from './user.controller.js';
import { User } from './user.schema.js';
import ProfileRepository from '../profile/profile.repository.js';
import { Profile } from '../profile/profile.schema.js';
import { sendActivationCodeToNewUser, sendByebyeEmail, sendPasswordResetCode } from '../../email/account_welcome_sendgrid.js';

const repository = new UserRepository(User);
const profileRepository = new ProfileRepository(Profile, User);
const service = new UserService(repository, profileRepository, {
    sendActivationCodeToNewUser,
    sendByebyeEmail,
    sendPasswordResetCode
});
const controller = new UserController(service);

export default {
    repository,
    profileRepository,
    service,
    controller
};
