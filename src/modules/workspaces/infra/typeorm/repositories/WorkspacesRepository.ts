import { Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import { WorkspaceMember } from "../../../../workspaceMembers/infra/typeorm/entities/WorkspaceMember.js";
import { ICreateWorkspaceDTO } from "../../../dtos/ICreateWorkspaceDTO.js";
import { IWorkspacesRepository } from "../../../repositories/IWorkspacesRepository.js";
import { Workspace } from "../entities/Workspace.js";

class WorkspacesRepository implements IWorkspacesRepository {
  private ormRepository: Repository<Workspace>;
  private workspaceMembersRepository: Repository<WorkspaceMember>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Workspace);
    this.workspaceMembersRepository = AppDataSource.getRepository(WorkspaceMember);
  }

  public async create(data: ICreateWorkspaceDTO): Promise<Workspace> {
    const workspace = this.ormRepository.create({
      name: data.name,
      ownerId: data.ownerId,
      frequency: data.frequency,
      mode: "private",
      shareToken: null,
    });

    await this.ormRepository.save(workspace);
    return workspace;
  }

  public async addMember(
    workspaceId: string,
    userId: string,
    role: "owner" | "member" = "member"
  ): Promise<void> {
    const existingMember = await this.workspaceMembersRepository.findOne({
      where: { workspaceId, userId },
    });

    if (existingMember) {
      return;
    }

    const member = this.workspaceMembersRepository.create({ workspaceId, userId, role });
    await this.workspaceMembersRepository.save(member);
  }

  public async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await this.workspaceMembersRepository.findOne({
      where: { workspaceId, userId },
    });

    return !!member;
  }

  public async listByUserId(userId: string): Promise<Workspace[]> {
    const members = await this.workspaceMembersRepository.find({
      where: { userId },
      relations: ["workspace"],
    });

    return members.map((member) => member.workspace);
  }

  public async findById(id: string): Promise<Workspace | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByShareToken(shareToken: string): Promise<Workspace | null> {
    return this.ormRepository.findOne({ where: { shareToken } });
  }

  public async update(workspace: Workspace): Promise<Workspace> {
    await this.ormRepository.save(workspace);
    return workspace;
  }
}

export { WorkspacesRepository };
