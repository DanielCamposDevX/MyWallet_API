import { container } from "tsyringe";
import "../../modules/users/providers/index.js";
import { SessionsRepository } from "../../modules/sessions/infra/typeorm/repositories/SessionsRepository.js";
import { ISessionsRepository } from "../../modules/sessions/repositories/ISessionsRepository.js";
import { UsersRepository } from "../../modules/users/infra/typeorm/repositories/UsersRepository.js";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository.js";

container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepository);
container.registerSingleton<ISessionsRepository>(
  "SessionsRepository",
  SessionsRepository,
);
