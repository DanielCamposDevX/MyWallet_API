import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const tagWorkspaceParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
});

const tagParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
  tagId: yup.string().uuid().required().label("tagId"),
});

const tagBodySchema = yup.object({
  name: yup.string().min(2).max(120).required().label("name"),
});

const tagPaginationQuerySchema = yup.object({
  page: yup.number().integer().min(1).default(1).label("page"),
  limit: yup.number().integer().min(1).max(100).default(10).label("limit"),
});

const createTagSchema = {
  params: tagWorkspaceParamsSchema,
  body: tagBodySchema,
};

const listTagSchema = {
  params: tagWorkspaceParamsSchema,
};

const listPaginatedTagSchema = {
  params: tagWorkspaceParamsSchema,
  query: tagPaginationQuerySchema,
};

const updateTagSchema = {
  params: tagParamsSchema,
  body: tagBodySchema,
};

const deleteTagSchema = {
  params: tagParamsSchema,
};

export type TagWorkspaceParams = yup.InferType<typeof tagWorkspaceParamsSchema>;
export type TagParams = yup.InferType<typeof tagParamsSchema>;
export type TagBody = yup.InferType<typeof tagBodySchema>;
export type TagPaginationQuery = yup.InferType<typeof tagPaginationQuerySchema>;

class TagsRequest {
  public async create(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createTagSchema);
    return next();
  }

  public async list(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, listTagSchema);
    return next();
  }

  public async listPaginated(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, listPaginatedTagSchema);
    return next();
  }

  public async update(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, updateTagSchema);
    return next();
  }

  public async delete(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, deleteTagSchema);
    return next();
  }
}

export { TagsRequest };
