import { inject, injectable } from "tsyringe";
import { Workspace } from "../infra/typeorm/entities/Workspace.js";
import { IWorkspacesRepository } from "../repositories/IWorkspacesRepository.js";

interface IRequest {
  userId: string;
  name: string;
  frequency?: "daily" | "weekly" | "monthly";
}

@injectable()
class CreateWorkspaceService {
  constructor(
    @inject("WorkspacesRepository")
    private workspacesRepository: IWorkspacesRepository
  ) {}

  public async execute({ userId, name, frequency = "monthly" }: IRequest): Promise<Workspace> {
    const workspace = await this.workspacesRepository.create({
      name,
      ownerId: userId,
      frequency,
    });

    await this.workspacesRepository.addMember(workspace.id, userId, "owner");
    return workspace;
  }
}

export { CreateWorkspaceService };
