import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { ITransactionsRepository } from "../repositories/ITransactionsRepository.js";

interface IRequest {
  workspaceId: string;
  transactionId: string;
  userId: string;
}

@injectable()
class DeleteTransactionService {
  constructor(
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute({ workspaceId, transactionId, userId }: IRequest): Promise<void> {
    const isMember = await this.transactionsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const transaction = await this.transactionsRepository.findById(transactionId);

    if (!transaction || transaction.workspaceId !== workspaceId) {
      throw new AppError("Transaction not found", 404);
    }

    await this.transactionsRepository.deleteById(transactionId);
  }
}

export { DeleteTransactionService };
