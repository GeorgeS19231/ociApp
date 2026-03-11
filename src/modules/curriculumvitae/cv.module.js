import CvRepository from "./cv.repository.js";
import CvService from "./cv.service.js";
import CvController from "./cv.controller.js";
import { CvSchema } from "./cv.schema.js";
import AssignmentRepository from "../assignment/assignment.repository.js";
import { Assignment } from "../assignment/assignment.schema.js";


const cvRepo = new CvRepository(CvSchema);
const assignmentRepo = new AssignmentRepository(Assignment);
const cvService = new CvService(cvRepo, assignmentRepo);
const cvController = new CvController(cvService);

export default {
    cvRepo,
    assignmentRepo,
    cvService,
    cvController,
};
