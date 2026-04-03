import type { Request, Response } from "express";
import { container } from "tsyringe";
import { getAuthenticatedUserId } from "../../../../../shared/infra/http/types/getAuthenticatedUserId.js";
import { CreateTagService } from "../../../services/CreateTagService.js";
import { DeleteTagService } from "../../../services/DeleteTagService.js";
import { ListPaginatedTagsService } from "../../../services/ListPaginatedTagsService.js";
import { ListTagsService } from "../../../services/ListTagsService.js";
import { UpdateTagService } from "../../../services/UpdateTagService.js";
import type {
  TagBody,
  TagPaginationQuery,
  TagParams,
  TagWorkspaceParams,
} from "../request/TagsRequest.js";

class TagsController {
  public async create(
    request: Request<TagWorkspaceParams, unknown, TagBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { name } = request.body;
    const userId = getAuthenticatedUserId(request);

    const createTag = container.resolve(CreateTagService);
    const tag = await createTag.execute({ workspaceId, userId, name });

    return response.status(201).json(tag);
  }

  public async index(
    request: Request<TagWorkspaceParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const listTags = container.resolve(ListTagsService);
    const tags = await listTags.execute({ workspaceId, userId });

    return response.status(200).json(tags);
  }

  public async indexPaginated(
    request: Request<TagWorkspaceParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { page, limit } = request.query as unknown as TagPaginationQuery;
    const userId = getAuthenticatedUserId(request);

    const listPaginatedTags = container.resolve(ListPaginatedTagsService);
    const tags = await listPaginatedTags.execute({ workspaceId, userId, page, limit });

    return response.status(200).json(tags);
  }

  public async update(
    request: Request<TagParams, unknown, TagBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId, tagId } = request.params;
    const { name } = request.body;
    const userId = getAuthenticatedUserId(request);

    const updateTag = container.resolve(UpdateTagService);
    const tag = await updateTag.execute({ workspaceId, tagId, userId, name });

    return response.status(200).json(tag);
  }

  public async delete(
    request: Request<TagParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId, tagId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const deleteTag = container.resolve(DeleteTagService);
    await deleteTag.execute({ workspaceId, tagId, userId });

    return response.status(204).send();
  }
}

export { TagsController };
