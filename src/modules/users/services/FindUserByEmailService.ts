import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { User } from "../infra/typeorm/entities/User.js";
import { IUsersRepository } from "../repositories/IUsersRepository.js";

interface IRequest {
  email: string;
}

@injectable()
class FindUserByEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ email }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export { FindUserByEmailService };
