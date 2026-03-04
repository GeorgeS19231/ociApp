import ProfileRepository from "./profile.repository.js";
import ProfileService from "./profile.service.js";
import ProfileController from "./profile.controller.js";
import { ProfileSchema } from "./profile.schema.js";
import { UserSchema } from "../user/user.schema.js"

const profileRepo = new ProfileRepository(ProfileSchema, UserSchema);
const profileService = new ProfileService(profileRepo);
const profileController = new ProfileController(profileService);

export default {
    profileRepo,
    profileService,
    profileController
}