import { v4 as uuid } from "uuid";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Workspace } from "../infra/typeorm/entities/Workspace.js";
import { IWorkspacesRepository } from "../repositories/IWorkspacesRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
  mode: "private" | "link";
}

@injectable()
class UpdateWorkspaceSharingService {
  constructor(
    @inject("WorkspacesRepository")
    private workspacesRepository: IWorkspacesRepository
  ) {}

  public async execute({ workspaceId, userId, mode }: IRequest): Promise<Workspace> {
    const workspace = await this.workspacesRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    if (workspace.ownerId !== userId) {
      throw new AppError("Only the workspace owner can change sharing settings", 403);
    }

    workspace.mode = mode;

    if (mode === "link") {
      workspace.shareToken = uuid();
    }

    if (mode === "private") {
      workspace.shareToken = null;
    }

    return this.workspacesRepository.update(workspace);
  }
}

export { UpdateWorkspaceSharingService };
