import { Router } from "express";
import { sessionRoutes } from "../../../modules/sessions/infra/http/routes/sessions.routes.js";
import { usersRoutes } from "../../../modules/users/infra/http/routes/users.routes.js";

const router = Router();

router.use(usersRoutes);
router.use(sessionRoutes);

export default router;
