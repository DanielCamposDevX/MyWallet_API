import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../../tags/infra/typeorm/entities/Tag.js";
import { ITransactionsRepository } from "../repositories/ITransactionsRepository.js";
import { Transaction } from "../infra/typeorm/entities/Transaction.js";

interface ISubTransactionInput {
  description: string;
  amount: number;
}

interface IRequest {
  workspaceId: string;
  transactionId: string;
  userId: string;
  type?: "income" | "expense";
  description?: string;
  amount?: number;
  competenceDate?: string;
  tagIds?: string[];
  subTransactions?: ISubTransactionInput[];
}

@injectable()
class UpdateTransactionService {
  constructor(
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute(data: IRequest): Promise<Transaction> {
    const isMember = await this.transactionsRepository.isMember(
      data.workspaceId,
      data.userId
    );

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const transaction = await this.transactionsRepository.findById(data.transactionId);

    if (!transaction || transaction.workspaceId !== data.workspaceId) {
      throw new AppError("Transaction not found", 404);
    }

    if (data.type) {
      transaction.type = data.type;
    }

    if (data.description) {
      transaction.description = data.description;
    }

    if (data.competenceDate) {
      transaction.competenceDate = data.competenceDate;
    }

    if (transaction.format === "simple" && data.amount !== undefined) {
      transaction.amount = data.amount.toFixed(2);
    }

    if (transaction.format === "advanced") {
      if (data.amount !== undefined) {
        throw new AppError("Advanced transactions amount is derived from sub-transactions", 400);
      }

      if (data.subTransactions && data.subTransactions.length > 0) {
        const totalAmount = data.subTransactions.reduce(
          (acc, subTransaction) => acc + subTransaction.amount,
          0
        );

        transaction.amount = totalAmount.toFixed(2);

        await this.transactionsRepository.replaceSubTransactions(
          transaction.id,
          data.subTransactions.map((subTransaction) => ({
            description: subTransaction.description,
            amount: subTransaction.amount.toFixed(2),
          }))
        );
      }
    }

    if (data.tagIds) {
      const tags = await this.validateAndResolveTags(data.workspaceId, data.tagIds);
      transaction.tags = tags;
    }

    return this.transactionsRepository.update(transaction);
  }

  private async validateAndResolveTags(
    workspaceId: string,
    tagIds: string[]
  ): Promise<Tag[]> {
    const tags = await this.transactionsRepository.findTagsByIds(tagIds);

    if (tags.length !== tagIds.length) {
      throw new AppError("One or more tags were not found", 404);
    }

    const allBelongToWorkspace = tags.every((tag) => tag.workspaceId === workspaceId);

    if (!allBelongToWorkspace) {
      throw new AppError("Tags must belong to the same workspace", 400);
    }

    return tags;
  }
}

export { UpdateTransactionService };
