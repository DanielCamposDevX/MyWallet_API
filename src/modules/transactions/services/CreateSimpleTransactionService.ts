import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../../tags/infra/typeorm/entities/Tag.js";
import { ICreateSimpleTransactionDTO } from "../dtos/ICreateSimpleTransactionDTO.js";
import {
  ITransactionCreateData,
  ITransactionsRepository,
} from "../repositories/ITransactionsRepository.js";
import { Transaction } from "../infra/typeorm/entities/Transaction.js";

@injectable()
class CreateSimpleTransactionService {
  constructor(
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute(data: ICreateSimpleTransactionDTO): Promise<Transaction[]> {
    const isMember = await this.transactionsRepository.isMember(
      data.workspaceId,
      data.createdByUserId
    );

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    if (data.recurrenceMonths < 1) {
      throw new AppError("recurrenceMonths must be at least 1", 400);
    }

    const tags = await this.validateAndResolveTags(data.workspaceId, data.tagIds);
    const recurringGroupId = data.recurrenceMonths > 1 ? uuid() : null;

    const createPayload: ITransactionCreateData[] = Array.from(
      { length: data.recurrenceMonths },
      (_, index) => ({
        workspaceId: data.workspaceId,
        createdByUserId: data.createdByUserId,
        type: data.type,
        format: "simple",
        description: data.description,
        amount: data.amount.toFixed(2),
        competenceDate: dayjs(data.competenceDate).add(index, "month").format("YYYY-MM-DD"),
        recurringGroupId,
        tags,
      })
    );

    return this.transactionsRepository.createMany(createPayload);
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

export { CreateSimpleTransactionService };
