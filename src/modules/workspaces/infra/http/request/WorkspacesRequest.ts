import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const workspaceIdParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
});

const joinByTokenParamsSchema = yup.object({
  token: yup.string().required().label("token"),
});

const createWorkspaceBodySchema = yup.object({
  name: yup.string().min(2).max(120).required().label("name"),
  frequency: yup
    .mixed<"daily" | "weekly" | "monthly">()
    .oneOf(["daily", "weekly", "monthly"])
    .default("monthly")
    .label("frequency"),
});

const updateWorkspaceSharingBodySchema = yup.object({
  mode: yup
    .mixed<"private" | "link">()
    .oneOf(["private", "link"])
    .required()
    .label("mode"),
});

const createWorkspaceSchema = {
  body: createWorkspaceBodySchema,
};

const updateWorkspaceSharingSchema = {
  params: workspaceIdParamsSchema,
  body: updateWorkspaceSharingBodySchema,
};

const joinByTokenSchema = {
  params: joinByTokenParamsSchema,
};

export type WorkspaceIdParams = yup.InferType<typeof workspaceIdParamsSchema>;
export type JoinByTokenParams = yup.InferType<typeof joinByTokenParamsSchema>;
export type CreateWorkspaceBody = yup.InferType<typeof createWorkspaceBodySchema>;
export type UpdateWorkspaceSharingBody = yup.InferType<
  typeof updateWorkspaceSharingBodySchema
>;

class WorkspacesRequest {
  public async create(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createWorkspaceSchema);
    return next();
  }

  public async updateSharing(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, updateWorkspaceSharingSchema);
    return next();
  }

  public async joinByToken(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, joinByTokenSchema);
    return next();
  }
}

export { WorkspacesRequest };
