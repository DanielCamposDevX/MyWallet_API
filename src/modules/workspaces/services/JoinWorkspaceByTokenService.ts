import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { IWorkspacesRepository } from "../repositories/IWorkspacesRepository.js";

interface IRequest {
  token: string;
  userId: string;
}

@injectable()
class JoinWorkspaceByTokenService {
  constructor(
    @inject("WorkspacesRepository")
    private workspacesRepository: IWorkspacesRepository
  ) {}

  public async execute({ token, userId }: IRequest): Promise<void> {
    const workspace = await this.workspacesRepository.findByShareToken(token);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    if (workspace.mode !== "link") {
      throw new AppError("Workspace is not accepting members by link", 403);
    }

    await this.workspacesRepository.addMember(workspace.id, userId, "member");
  }
}

export { JoinWorkspaceByTokenService };
