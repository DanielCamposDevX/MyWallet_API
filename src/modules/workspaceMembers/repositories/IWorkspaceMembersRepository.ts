import { Workspace } from "../../workspaces/infra/typeorm/entities/Workspace.js";

interface IWorkspaceMembersRepository {
  addMember(
    workspaceId: string,
    userId: string,
    role?: "owner" | "member"
  ): Promise<void>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  listWorkspacesByUserId(userId: string): Promise<Workspace[]>;
}

export { IWorkspaceMembersRepository };
