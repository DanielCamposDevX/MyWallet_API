import { inject, injectable } from "tsyringe";
import { ISessionsRepository } from "../repositories/ISessionsRepository.js";

@injectable()
class LogoffUserService {
  constructor(
    @inject("SessionsRepository")
    private sessionsRepository: ISessionsRepository
  ) {}

  public async execute(id: string): Promise<void> {
    await this.sessionsRepository.deleteById(id);
  }
}

export { LogoffUserService };
