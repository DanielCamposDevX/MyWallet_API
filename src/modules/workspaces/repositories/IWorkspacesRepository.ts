import { ICreateWorkspaceDTO } from "../dtos/ICreateWorkspaceDTO.js";
import { Workspace } from "../infra/typeorm/entities/Workspace.js";

interface IWorkspacesRepository {
  create(data: ICreateWorkspaceDTO): Promise<Workspace>;
  addMember(
    workspaceId: string,
    userId: string,
    role?: "owner" | "member"
  ): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  listByUserId(userId: string): Promise<Workspace[]>;
  findById(id: string): Promise<Workspace | null>;
  findByShareToken(shareToken: string): Promise<Workspace | null>;
  update(workspace: Workspace): Promise<Workspace>;
}

export { IWorkspacesRepository };
