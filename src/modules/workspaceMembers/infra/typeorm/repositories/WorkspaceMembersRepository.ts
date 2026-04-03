import { Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import { Workspace } from "../../../../workspaces/infra/typeorm/entities/Workspace.js";
import { IWorkspaceMembersRepository } from "../../../repositories/IWorkspaceMembersRepository.js";
import { WorkspaceMember } from "../entities/WorkspaceMember.js";

class WorkspaceMembersRepository implements IWorkspaceMembersRepository {
  private ormRepository: Repository<WorkspaceMember>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(WorkspaceMember);
  }

  public async addMember(
    workspaceId: string,
    userId: string,
    role: "owner" | "member" = "member"
  ): Promise<void> {
    const existingMember = await this.ormRepository.findOne({
      where: { workspaceId, userId },
    });

    if (existingMember) {
      return;
    }

    const member = this.ormRepository.create({ workspaceId, userId, role });
    await this.ormRepository.save(member);
  }

  public async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await this.ormRepository.findOne({
      where: { workspaceId, userId },
    });

    return !!member;
  }

  public async listWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    const members = await this.ormRepository.find({
      where: { userId },
      relations: ["workspace"],
    });

    return members.map((member) => member.workspace);
  }
}

export { WorkspaceMembersRepository };
