import { Router } from "express";
import { SessionsController } from "../controllers/SessionsController.js";
import { SessionsRequest } from "../request/SessionsRequest.js";

const sessionRoutes = Router();
const sessionsController = new SessionsController();
const sessionsRequest = new SessionsRequest();

sessionRoutes.post("/signin", sessionsRequest.create, sessionsController.create);
sessionRoutes.post("/logoff", sessionsRequest.delete, sessionsController.delete);

export { sessionRoutes };
