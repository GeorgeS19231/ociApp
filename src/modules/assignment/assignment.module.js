import AssignmentRepository from "./assignment.repository.js";
import AssignmentService from "./assignment.service.js";
import AssignmentController from "./assignment.controller.js";
import { Assignment } from "./assignment.schema.js";

const repo = new AssignmentRepository(Assignment);
const service = new AssignmentService(repo);
const controller = new AssignmentController(service);

export default {
    repo,
    service,
    controller
};