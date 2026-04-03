import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Session } from "../../../modules/sessions/infra/typeorm/entities/Session.js";
import { SubTransaction } from "../../../modules/subTransactions/infra/typeorm/entities/SubTransaction.js";
import { Tag } from "../../../modules/tags/infra/typeorm/entities/Tag.js";
import { Transaction } from "../../../modules/transactions/infra/typeorm/entities/Transaction.js";
import { User } from "../../../modules/users/infra/typeorm/entities/User.js";
import { WorkspaceMember } from "../../../modules/workspaceMembers/infra/typeorm/entities/WorkspaceMember.js";
import { Workspace } from "../../../modules/workspaces/infra/typeorm/entities/Workspace.js";
import { migrations } from "./migrations/index.js";

dotenv.config();

const dbPort = Number(process.env.DB_PORT ?? 3306);
const shouldSync =
  (process.env.TYPEORM_SYNCHRONIZE ?? "false").toLowerCase() === "true";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: dbPort,
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_NAME ?? "mywallet",
  entities: [
    User,
    Session,
    Workspace,
    WorkspaceMember,
    Tag,
    Transaction,
    SubTransaction,
  ],
  migrations,
  synchronize: shouldSync,
  logging: false,
});
