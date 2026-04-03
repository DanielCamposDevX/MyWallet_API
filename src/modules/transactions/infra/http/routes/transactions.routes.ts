import { Router } from "express";
import { ensureAuthenticated } from "../../../../../shared/infra/http/middlewares/EnsureAuthenticated.js";
import { TransactionsController } from "../controllers/TransactionsController.js";
import { TransactionsRequest } from "../request/TransactionsRequest.js";

const transactionsRoutes = Router();
const transactionsController = new TransactionsController();
const transactionsRequest = new TransactionsRequest();

transactionsRoutes.use(ensureAuthenticated);

transactionsRoutes.post(
  "/workspaces/:workspaceId/transactions/simple",
  transactionsRequest.createSimple,
  transactionsController.createSimple
);
transactionsRoutes.post(
  "/workspaces/:workspaceId/transactions/advanced",
  transactionsRequest.createAdvanced,
  transactionsController.createAdvanced
);
transactionsRoutes.get(
  "/workspaces/:workspaceId/transactions",
  transactionsRequest.list,
  transactionsController.index
);
transactionsRoutes.patch(
  "/workspaces/:workspaceId/transactions/:transactionId",
  transactionsRequest.update,
  transactionsController.update
);
transactionsRoutes.delete(
  "/workspaces/:workspaceId/transactions/:transactionId",
  transactionsRequest.delete,
  transactionsController.delete
);

export { transactionsRoutes };
