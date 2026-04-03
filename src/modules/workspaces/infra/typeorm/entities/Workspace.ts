import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { WorkspaceMember } from "../../../../workspaceMembers/infra/typeorm/entities/WorkspaceMember.js";

@Entity({ name: "workspaces" })
export class Workspace {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "enum", enum: ["private", "link"], default: "private" })
  mode!: "private" | "link";

  @Column({ type: "enum", enum: ["daily", "weekly", "monthly"] })
  frequency!: "daily" | "weekly" | "monthly";

  @Column({ type: "varchar", length: 255, nullable: true })
  shareToken!: string | null;

  @Column({ type: "uuid" })
  ownerId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => WorkspaceMember, (member) => member.workspace)
  members!: WorkspaceMember[];
}
