import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "installments" })
export class Installment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  workspaceId!: string;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "int", unsigned: true })
  installmentCount!: number;

  @Column({ type: "int", unsigned: true, default: 0 })
  paidInstallments!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: "0.00" })
  installmentAmount!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
