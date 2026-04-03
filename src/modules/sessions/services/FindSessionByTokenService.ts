import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { User } from "../../users/infra/typeorm/entities/User.js";
import { ISessionsRepository } from "../repositories/ISessionsRepository.js";

interface IRequest {
  token: string;
}

@injectable()
class FindSessionByTokenService {
  constructor(
    @inject("SessionsRepository")
    private sessionsRepository: ISessionsRepository
  ) {}

  public async execute({ token }: IRequest): Promise<User> {
    const session = await this.sessionsRepository.findByToken(token);

    if (!session) {
      throw new AppError("Session not found", 404);
    }

    return session;
  }
}

export { FindSessionByTokenService };
