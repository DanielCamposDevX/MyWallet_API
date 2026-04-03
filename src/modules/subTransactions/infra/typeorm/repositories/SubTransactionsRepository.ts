import { Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import {
  ISubTransactionCreateData,
  ISubTransactionPaginationResult,
  ISubTransactionsRepository,
} from "../../../repositories/ISubTransactionsRepository.js";
import { SubTransaction } from "../entities/SubTransaction.js";

class SubTransactionsRepository implements ISubTransactionsRepository {
  private ormRepository: Repository<SubTransaction>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(SubTransaction);
  }

  public async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await AppDataSource.getRepository("workspace_members")
      .createQueryBuilder("workspaceMember")
      .where("workspaceMember.workspaceId = :workspaceId", { workspaceId })
      .andWhere("workspaceMember.userId = :userId", { userId })
      .getRawOne();

    return !!member;
  }

  public async replaceByTransactionId(
    transactionId: string,
    subTransactions: ISubTransactionCreateData[]
  ): Promise<SubTransaction[]> {
    await this.ormRepository.delete({ transactionId });

    const entities = this.ormRepository.create(
      subTransactions.map((subTransaction) => ({
        transactionId,
        description: subTransaction.description,
        amount: subTransaction.amount,
      }))
    );

    await this.ormRepository.save(entities);

    return this.ormRepository.find({
      where: { transactionId },
      order: { createdAt: "ASC" },
    });
  }

  public async listByWorkspaceIdPaginated(
    workspaceId: string,
    page: number,
    limit: number
  ): Promise<ISubTransactionPaginationResult> {
    const queryBuilder = this.ormRepository
      .createQueryBuilder("subTransaction")
      .innerJoinAndSelect("subTransaction.transaction", "transaction")
      .where("transaction.workspaceId = :workspaceId", { workspaceId })
      .orderBy("subTransaction.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }
}

export { SubTransactionsRepository };
