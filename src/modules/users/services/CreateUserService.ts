import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO.js";
import { IHashProvider } from "../providers/HashProvider/models/IHashProvider.js";
import { IUsersRepository } from "../repositories/IUsersRepository.js";

@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}

export { CreateUserService };
