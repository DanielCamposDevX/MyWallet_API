import type { Request, Response } from "express";
import { container } from "tsyringe";
import { getAuthenticatedUserId } from "../../../../../shared/infra/http/types/getAuthenticatedUserId.js";
import { CreateWorkspaceService } from "../../../services/CreateWorkspaceService.js";
import { JoinWorkspaceByTokenService } from "../../../services/JoinWorkspaceByTokenService.js";
import { ListWorkspacesService } from "../../../services/ListWorkspacesService.js";
import { UpdateWorkspaceSharingService } from "../../../services/UpdateWorkspaceSharingService.js";
import type {
  CreateWorkspaceBody,
  JoinByTokenParams,
  UpdateWorkspaceSharingBody,
  WorkspaceIdParams,
} from "../request/WorkspacesRequest.js";

class WorkspacesController {
  public async create(
    request: Request<Record<string, never>, unknown, CreateWorkspaceBody>,
    response: Response
  ): Promise<Response> {
    const { name, frequency } = request.body;
    const userId = getAuthenticatedUserId(request);

    const createWorkspace = container.resolve(CreateWorkspaceService);
    const workspace = await createWorkspace.execute({ userId, name, frequency });

    return response.status(201).json(workspace);
  }

  public async index(
    request: Request,
    response: Response
  ): Promise<Response> {
    const userId = getAuthenticatedUserId(request);

    const listWorkspaces = container.resolve(ListWorkspacesService);
    const workspaces = await listWorkspaces.execute(userId);

    return response.status(200).json(workspaces);
  }

  public async updateSharing(
    request: Request<WorkspaceIdParams, unknown, UpdateWorkspaceSharingBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { mode } = request.body;
    const userId = getAuthenticatedUserId(request);

    const updateWorkspaceSharing = container.resolve(UpdateWorkspaceSharingService);
    const workspace = await updateWorkspaceSharing.execute({
      workspaceId,
      userId,
      mode,
    });

    return response.status(200).json(workspace);
  }

  public async joinByToken(
    request: Request<JoinByTokenParams>,
    response: Response
  ): Promise<Response> {
    const { token } = request.params;
    const userId = getAuthenticatedUserId(request);

    const joinWorkspaceByToken = container.resolve(JoinWorkspaceByTokenService);
    await joinWorkspaceByToken.execute({ token, userId });

    return response.status(204).send();
  }
}

export { WorkspacesController };
