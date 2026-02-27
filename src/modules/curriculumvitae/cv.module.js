import CvRepository from "./cv.repository.js";
import CvService from "./cv.service.js";
import CvController from "./cv.controller.js";
import { CvSchema } from "./cv.schema";


const cvRepo = new CvRepository(CvSchema);
const cvService = new CvService(cvRepo);
const cvController = new CvController(cvService);

export default {
cvRepo,
cvService,
cvController,
}
