import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Session } from "../../../../sessions/infra/typeorm/entities/Session.js";

@Entity({ name: "users" })
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 180 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];
}
