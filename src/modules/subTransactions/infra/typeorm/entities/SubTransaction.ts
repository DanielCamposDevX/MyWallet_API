import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "../../../../transactions/infra/typeorm/entities/Transaction.js";

@Entity({ name: "sub_transactions" })
export class SubTransaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  transactionId!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.subTransactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "transactionId" })
  transaction!: Transaction;

  @CreateDateColumn()
  createdAt!: Date;
}
