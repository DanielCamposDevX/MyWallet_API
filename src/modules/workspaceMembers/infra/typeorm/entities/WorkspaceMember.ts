import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "../../../../users/infra/typeorm/entities/User.js";
import { Workspace } from "../../../../workspaces/infra/typeorm/entities/Workspace.js";

@Entity({ name: "workspace_members" })
@Unique(["workspaceId", "userId"])
export class WorkspaceMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  workspaceId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "enum", enum: ["owner", "member"], default: "member" })
  role!: "owner" | "member";

  @ManyToOne(() => Workspace, (workspace) => workspace.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "workspaceId" })
  workspace!: Workspace;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
