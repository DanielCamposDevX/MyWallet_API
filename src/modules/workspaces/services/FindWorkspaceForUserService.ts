import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Workspace } from "../infra/typeorm/entities/Workspace.js";
import { IWorkspacesRepository } from "../repositories/IWorkspacesRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
}

@injectable()
class FindWorkspaceForUserService {
  constructor(
    @inject("WorkspacesRepository")
    private workspacesRepository: IWorkspacesRepository
  ) {}

  public async execute({ workspaceId, userId }: IRequest): Promise<Workspace> {
    const workspace = await this.workspacesRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    const isMember = await this.workspacesRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    return workspace;
  }
}

export { FindWorkspaceForUserService };
