import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Transaction } from "../../../../transactions/infra/typeorm/entities/Transaction.js";

@Entity({ name: "tags" })
@Unique(["workspaceId", "name"])
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  workspaceId!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @ManyToMany(() => Transaction, (transaction) => transaction.tags)
  transactions!: Transaction[];

  @CreateDateColumn()
  createdAt!: Date;
}
