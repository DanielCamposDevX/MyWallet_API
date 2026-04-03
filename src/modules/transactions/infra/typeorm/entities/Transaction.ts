import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SubTransaction } from "../../../../subTransactions/infra/typeorm/entities/SubTransaction.js";
import { Tag } from "../../../../tags/infra/typeorm/entities/Tag.js";

@Entity({ name: "transactions" })
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  workspaceId!: string;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @Column({ type: "enum", enum: ["income", "expense"] })
  type!: "income" | "expense";

  @Column({ type: "enum", enum: ["simple", "advanced"] })
  format!: "simple" | "advanced";

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: string;

  @Column({ type: "date" })
  competenceDate!: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  recurringGroupId!: string | null;

  @OneToMany(() => SubTransaction, (subTransaction) => subTransaction.transaction)
  subTransactions!: SubTransaction[];

  @ManyToMany(() => Tag, (tag) => tag.transactions)
  @JoinTable({
    name: "transaction_tags",
    joinColumn: { name: "transactionId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
  })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
