import { Router } from "express";
import { SessionsController } from "../controllers/SessionsController.js";

const sessionRoutes = Router();
const sessionsController = new SessionsController();

sessionRoutes.post("/signin", sessionsController.create);
sessionRoutes.post("/logoff", sessionsController.delete);

export { sessionRoutes };
