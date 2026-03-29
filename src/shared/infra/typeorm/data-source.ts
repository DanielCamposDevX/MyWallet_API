import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Session } from "../../../modules/sessions/infra/typeorm/entities/Session.js";
import { User } from "../../../modules/users/infra/typeorm/entities/User.js";

dotenv.config();

const dbPort = Number(process.env.DB_PORT ?? 3306);
const shouldSync =
  (process.env.TYPEORM_SYNCHRONIZE ?? "true").toLowerCase() === "true";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: dbPort,
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_NAME ?? "mywallet",
  entities: [User, Session],
  synchronize: shouldSync,
  logging: false,
});
