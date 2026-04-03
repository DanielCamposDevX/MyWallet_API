import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../../tags/infra/typeorm/entities/Tag.js";
import { ICreateAdvancedTransactionDTO } from "../dtos/ICreateAdvancedTransactionDTO.js";
import { ITransactionsRepository } from "../repositories/ITransactionsRepository.js";
import { Transaction } from "../infra/typeorm/entities/Transaction.js";

@injectable()
class CreateAdvancedTransactionService {
  constructor(
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute(data: ICreateAdvancedTransactionDTO): Promise<Transaction> {
    const isMember = await this.transactionsRepository.isMember(
      data.workspaceId,
      data.createdByUserId
    );

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const tags = await this.validateAndResolveTags(data.workspaceId, data.tagIds);

    const totalAmount = data.subTransactions.reduce(
      (acc, subTransaction) => acc + subTransaction.amount,
      0
    );

    const transaction = await this.transactionsRepository.create({
      workspaceId: data.workspaceId,
      createdByUserId: data.createdByUserId,
      type: data.type,
      format: "advanced",
      description: data.description,
      amount: totalAmount.toFixed(2),
      competenceDate: data.competenceDate,
      recurringGroupId: null,
      tags,
    });

    await this.transactionsRepository.replaceSubTransactions(
      transaction.id,
      data.subTransactions.map((subTransaction) => ({
        description: subTransaction.description,
        amount: subTransaction.amount.toFixed(2),
      }))
    );

    const persistedTransaction = await this.transactionsRepository.findById(transaction.id);

    if (!persistedTransaction) {
      throw new AppError("Transaction not found", 404);
    }

    return persistedTransaction;
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

export { CreateAdvancedTransactionService };
