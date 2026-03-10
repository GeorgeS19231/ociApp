import ProfileRepository from "./profile.repository.js";
import ProfileService from "./profile.service.js";
import ProfileController from "./profile.controller.js";
import { Profile } from "./profile.schema.js";
import { User } from "../user/user.schema.js";

const profileRepo = new ProfileRepository(Profile, User);
const profileService = new ProfileService(profileRepo);
const profileController = new ProfileController(profileService);

export default {
    profileRepo,
    profileService,
    profileController
}
