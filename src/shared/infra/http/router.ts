import { Router } from "express";
import { dashboardRoutes } from "../../../modules/dashboard/infra/http/routes/dashboard.routes.js";
import { installmentsRoutes } from "../../../modules/installments/infra/http/routes/installments.routes.js";
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
router.use(dashboardRoutes);
router.use(installmentsRoutes);
router.use(tagsRoutes);
router.use(transactionsRoutes);
router.use(subTransactionsRoutes);

export default router;
