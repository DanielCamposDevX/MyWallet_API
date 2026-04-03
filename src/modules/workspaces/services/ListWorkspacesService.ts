import { inject, injectable } from "tsyringe";
import { Workspace } from "../infra/typeorm/entities/Workspace.js";
import { IWorkspacesRepository } from "../repositories/IWorkspacesRepository.js";

@injectable()
class ListWorkspacesService {
  constructor(
    @inject("WorkspacesRepository")
    private workspacesRepository: IWorkspacesRepository
  ) {}

  public async execute(userId: string): Promise<Workspace[]> {
    return this.workspacesRepository.listByUserId(userId);
  }
}

export { ListWorkspacesService };
