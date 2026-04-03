import { Router } from "express";
import { ensureAuthenticated } from "../../../../../shared/infra/http/middlewares/EnsureAuthenticated.js";
import { InstallmentsController } from "../controllers/InstallmentsController.js";
import { InstallmentsRequest } from "../request/InstallmentsRequest.js";

const installmentsRoutes = Router();
const installmentsController = new InstallmentsController();
const installmentsRequest = new InstallmentsRequest();

installmentsRoutes.use(ensureAuthenticated);

installmentsRoutes.post(
  "/workspaces/:workspaceId/installments",
  installmentsRequest.create,
  installmentsController.create
);
installmentsRoutes.get(
  "/workspaces/:workspaceId/installments",
  installmentsRequest.list,
  installmentsController.index
);
installmentsRoutes.patch(
  "/workspaces/:workspaceId/installments/:installmentId",
  installmentsRequest.update,
  installmentsController.update
);
installmentsRoutes.delete(
  "/workspaces/:workspaceId/installments/:installmentId",
  installmentsRequest.delete,
  installmentsController.delete
);

export { installmentsRoutes };
