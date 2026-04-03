import { container } from "tsyringe";
import "../../modules/users/providers/index.js";
import { InstallmentsRepository } from "../../modules/installments/infra/typeorm/repositories/InstallmentsRepository.js";
import { IInstallmentsRepository } from "../../modules/installments/repositories/IInstallmentsRepository.js";
import { SessionsRepository } from "../../modules/sessions/infra/typeorm/repositories/SessionsRepository.js";
import { ISessionsRepository } from "../../modules/sessions/repositories/ISessionsRepository.js";
import { SubTransactionsRepository } from "../../modules/subTransactions/infra/typeorm/repositories/SubTransactionsRepository.js";
import { ISubTransactionsRepository } from "../../modules/subTransactions/repositories/ISubTransactionsRepository.js";
import { TagsRepository } from "../../modules/tags/infra/typeorm/repositories/TagsRepository.js";
import { ITagsRepository } from "../../modules/tags/repositories/ITagsRepository.js";
import { TransactionsRepository } from "../../modules/transactions/infra/typeorm/repositories/TransactionsRepository.js";
import { ITransactionsRepository } from "../../modules/transactions/repositories/ITransactionsRepository.js";
import { UsersRepository } from "../../modules/users/infra/typeorm/repositories/UsersRepository.js";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository.js";
import { WorkspaceMembersRepository } from "../../modules/workspaceMembers/infra/typeorm/repositories/WorkspaceMembersRepository.js";
import { IWorkspaceMembersRepository } from "../../modules/workspaceMembers/repositories/IWorkspaceMembersRepository.js";
import { WorkspacesRepository } from "../../modules/workspaces/infra/typeorm/repositories/WorkspacesRepository.js";
import { IWorkspacesRepository } from "../../modules/workspaces/repositories/IWorkspacesRepository.js";

container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepository);
container.registerSingleton<IInstallmentsRepository>(
  "InstallmentsRepository",
  InstallmentsRepository
);
container.registerSingleton<ISessionsRepository>(
  "SessionsRepository",
  SessionsRepository,
);
container.registerSingleton<IWorkspacesRepository>(
  "WorkspacesRepository",
  WorkspacesRepository
);
container.registerSingleton<ITagsRepository>("TagsRepository", TagsRepository);
container.registerSingleton<ITransactionsRepository>(
  "TransactionsRepository",
  TransactionsRepository
);
container.registerSingleton<IWorkspaceMembersRepository>(
  "WorkspaceMembersRepository",
  WorkspaceMembersRepository
);
container.registerSingleton<ISubTransactionsRepository>(
  "SubTransactionsRepository",
  SubTransactionsRepository
);
