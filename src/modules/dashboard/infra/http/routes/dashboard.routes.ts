import { Router } from "express";
import { ensureAuthenticated } from "../../../../../shared/infra/http/middlewares/EnsureAuthenticated.js";
import { DashboardController } from "../controllers/DashboardController.js";
import { DashboardRequest } from "../request/DashboardRequest.js";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();
const dashboardRequest = new DashboardRequest();

dashboardRoutes.use(ensureAuthenticated);

dashboardRoutes.get(
  "/workspaces/:workspaceId/dashboard",
  dashboardRequest.index,
  dashboardController.index
);

export { dashboardRoutes };
