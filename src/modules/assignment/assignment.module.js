import AssignmentRepository from "./assignment.repository.js";
import AssignmentService from "./assignment.service.js";
import AssignmentController from "./assignment.controller.js";
import { Assignment } from "./assignment.schema.js";
import JobRepository from "../job/job.repository.js";
import { Job } from "../job/job.schema.js";

const repo = new AssignmentRepository(Assignment);
const jobRepo = new JobRepository(Job);
const service = new AssignmentService(repo, jobRepo);
const controller = new AssignmentController(service);

export default {
    repo,
    jobRepo,
    service,
    controller
};
