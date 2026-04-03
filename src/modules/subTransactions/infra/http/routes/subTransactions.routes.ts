import { Router } from "express";
import { ensureAuthenticated } from "../../../../../shared/infra/http/middlewares/EnsureAuthenticated.js";
import { SubTransactionsController } from "../controllers/SubTransactionsController.js";
import { SubTransactionsRequest } from "../request/SubTransactionsRequest.js";

const subTransactionsRoutes = Router();
const subTransactionsController = new SubTransactionsController();
const subTransactionsRequest = new SubTransactionsRequest();

subTransactionsRoutes.use(ensureAuthenticated);

subTransactionsRoutes.get(
  "/workspaces/:workspaceId/sub-transactions/paginated",
  subTransactionsRequest.listPaginated,
  subTransactionsController.indexPaginated
);

export { subTransactionsRoutes };
