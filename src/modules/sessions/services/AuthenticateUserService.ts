import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { User } from "../../users/infra/typeorm/entities/User.js";
import { IHashProvider } from "../../users/providers/HashProvider/models/IHashProvider.js";
import { ISessionsRepository } from "../repositories/ISessionsRepository.js";

interface IRequest {
  user: User;
  password: string;
}

interface IResponse {
  token: string;
  name: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject("SessionsRepository")
    private sessionsRepository: ISessionsRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ password, user }: IRequest): Promise<IResponse> {
    const passwordMatches = await this.hashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatches) {
      throw new AppError("Wrong password", 401);
    }

    const existingSession = await this.sessionsRepository.findByUserId(user.id);

    if (existingSession) {
      return {
        token: existingSession.token,
        name: user.name,
      };
    }

    const createdSession = await this.sessionsRepository.create(user.id);

    return {
      token: createdSession.token,
      name: user.name,
    };
  }
}

export { AuthenticateUserService };
