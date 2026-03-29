import { Session } from "../infra/typeorm/entities/Session.js";

interface ISessionsRepository {
  create(userId: string): Promise<Session>;
  findByUserId(userId: string): Promise<Session | null>;
  findByToken(token: string): Promise<Session | null>;
  deleteById(id: string): Promise<void>;
}

export { ISessionsRepository };
