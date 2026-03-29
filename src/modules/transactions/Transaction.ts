import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../users.ts/User.js";

@Entity({ name: "transactions" })
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "double" })
  value!: number;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "enum", enum: ["entrada", "saida"] })
  type!: "entrada" | "saida";

  @Column({ type: "varchar", length: 5 })
  date!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
