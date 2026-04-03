import { Router } from "express";
import { sessionRoutes } from "../../../modules/sessions/infra/http/routes/sessions.routes.js";
import { subTransactionsRoutes } from "../../../modules/subTransactions/infra/http/routes/subTransactions.routes.js";
import { tagsRoutes } from "../../../modules/tags/infra/http/routes/tags.routes.js";
import { transactionsRoutes } from "../../../modules/transactions/infra/http/routes/transactions.routes.js";
import { usersRoutes } from "../../../modules/users/infra/http/routes/users.routes.js";
import { workspacesRoutes } from "../../../modules/workspaces/infra/http/routes/workspaces.routes.js";

const router = Router();

router.use(usersRoutes);
router.use(sessionRoutes);
router.use(workspacesRoutes);
router.use(tagsRoutes);
router.use(transactionsRoutes);
router.use(subTransactionsRoutes);

export default router;
