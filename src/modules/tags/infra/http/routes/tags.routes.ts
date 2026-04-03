import { Router } from "express";
import { ensureAuthenticated } from "../../../../../shared/infra/http/middlewares/EnsureAuthenticated.js";
import { TagsController } from "../controllers/TagsController.js";
import { TagsRequest } from "../request/TagsRequest.js";

const tagsRoutes = Router();
const tagsController = new TagsController();
const tagsRequest = new TagsRequest();

tagsRoutes.use(ensureAuthenticated);

tagsRoutes.post(
  "/workspaces/:workspaceId/tags",
  tagsRequest.create,
  tagsController.create
);
tagsRoutes.get("/workspaces/:workspaceId/tags", tagsRequest.list, tagsController.index);
tagsRoutes.get(
  "/workspaces/:workspaceId/tags/paginated",
  tagsRequest.listPaginated,
  tagsController.indexPaginated
);
tagsRoutes.patch(
  "/workspaces/:workspaceId/tags/:tagId",
  tagsRequest.update,
  tagsController.update
);
tagsRoutes.delete(
  "/workspaces/:workspaceId/tags/:tagId",
  tagsRequest.delete,
  tagsController.delete
);

export { tagsRoutes };
