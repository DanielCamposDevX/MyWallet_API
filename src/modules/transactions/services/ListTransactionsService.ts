import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Transaction } from "../infra/typeorm/entities/Transaction.js";
import { ITransactionsRepository } from "../repositories/ITransactionsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
}

@injectable()
class ListTransactionsService {
  constructor(
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute({ workspaceId, userId }: IRequest): Promise<Transaction[]> {
    const isMember = await this.transactionsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    return this.transactionsRepository.listByWorkspaceId(workspaceId);
  }
}

export { ListTransactionsService };
