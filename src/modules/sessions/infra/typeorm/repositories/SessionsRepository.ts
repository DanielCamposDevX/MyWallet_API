import { v4 as uuid } from "uuid";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import { ISessionsRepository } from "../../../repositories/ISessionsRepository.js";
import { Session } from "../entities/Session.js";

class SessionsRepository implements ISessionsRepository {
  private ormRepository: Repository<Session>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Session);
  }

  public async create(userId: string): Promise<Session> {
    const session = this.ormRepository.create({
      userId,
      token: uuid(),
    });

    await this.ormRepository.save(session);
    return session;
  }

  public async findByUserId(userId: string): Promise<Session | null> {
    return this.ormRepository.findOne({ where: { userId } });
  }

  public async findByToken(token: string): Promise<Session | null> {
    return this.ormRepository.findOne({ where: { token } });
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export { SessionsRepository };
