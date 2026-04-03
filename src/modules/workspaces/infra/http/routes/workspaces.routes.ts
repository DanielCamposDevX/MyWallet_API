import { Router } from "express";
import { ensureAuthenticated } from "../../../../../shared/infra/http/middlewares/EnsureAuthenticated.js";
import { WorkspacesController } from "../controllers/WorkspacesController.js";
import { WorkspacesRequest } from "../request/WorkspacesRequest.js";

const workspacesRoutes = Router();
const workspacesController = new WorkspacesController();
const workspacesRequest = new WorkspacesRequest();

workspacesRoutes.use(ensureAuthenticated);

workspacesRoutes.post("/workspaces", workspacesRequest.create, workspacesController.create);
workspacesRoutes.get("/workspaces", workspacesController.index);
workspacesRoutes.patch(
  "/workspaces/:workspaceId/sharing",
  workspacesRequest.updateSharing,
  workspacesController.updateSharing
);
workspacesRoutes.post(
  "/workspaces/join/:token",
  workspacesRequest.joinByToken,
  workspacesController.joinByToken
);

export { workspacesRoutes };
