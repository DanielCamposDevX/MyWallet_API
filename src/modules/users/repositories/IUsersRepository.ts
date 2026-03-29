import { ICreateUserDTO } from "../dtos/ICreateUserDTO.js";
import { User } from "../infra/typeorm/entities/User.js";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export { IUsersRepository };
