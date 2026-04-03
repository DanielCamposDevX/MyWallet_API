import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import { buildMonthRange } from "../../../../../shared/utils/date/monthRange.js";
import { SubTransaction } from "../../../../subTransactions/infra/typeorm/entities/SubTransaction.js";
import { ISubTransactionCreateData } from "../../../../subTransactions/repositories/ISubTransactionsRepository.js";
import { Tag } from "../../../../tags/infra/typeorm/entities/Tag.js";
import {
  ITransactionCreateData,
  ITransactionsRepository,
} from "../../../repositories/ITransactionsRepository.js";
import { Transaction } from "../entities/Transaction.js";

class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;
  private tagsRepository: Repository<Tag>;
  private subTransactionsRepository: Repository<SubTransaction>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Transaction);
    this.tagsRepository = AppDataSource.getRepository(Tag);
    this.subTransactionsRepository = AppDataSource.getRepository(SubTransaction);
  }

  public async create(data: ITransactionCreateData): Promise<Transaction> {
    const transaction = this.ormRepository.create(data);
    await this.ormRepository.save(transaction);
    return this.findByIdOrFail(transaction.id);
  }

  public async createMany(data: ITransactionCreateData[]): Promise<Transaction[]> {
    const transactions = this.ormRepository.create(data);
    await this.ormRepository.save(transactions);

    const persisted = await Promise.all(
      transactions.map((transaction) => this.findByIdOrFail(transaction.id))
    );

    return persisted;
  }

  public async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await AppDataSource.getRepository("workspace_members")
      .createQueryBuilder("workspaceMember")
      .where("workspaceMember.workspaceId = :workspaceId", { workspaceId })
      .andWhere("workspaceMember.userId = :userId", { userId })
      .getRawOne();

    return !!member;
  }

  public async findTagsByIds(ids: string[]): Promise<Tag[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.tagsRepository.find({ where: { id: In(ids) } });
  }

  public async replaceSubTransactions(
    transactionId: string,
    subTransactions: ISubTransactionCreateData[]
  ): Promise<void> {
    await this.subTransactionsRepository.delete({ transactionId });

    const entities = this.subTransactionsRepository.create(
      subTransactions.map((subTransaction) => ({
        transactionId,
        description: subTransaction.description,
        amount: subTransaction.amount,
      }))
    );

    await this.subTransactionsRepository.save(entities);
  }

  public async findById(id: string): Promise<Transaction | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ["subTransactions", "tags"],
      order: {
        subTransactions: {
          createdAt: "ASC",
        },
      },
    });
  }

  public async listByWorkspaceId(workspaceId: string, month?: string): Promise<Transaction[]> {
    const { startDate, endDate } = buildMonthRange(month);

    return this.ormRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.subTransactions", "subTransactions")
      .leftJoinAndSelect("transaction.tags", "tags")
      .where("transaction.workspaceId = :workspaceId", { workspaceId })
      .andWhere("transaction.competenceDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("transaction.competenceDate", "DESC")
      .addOrderBy("transaction.createdAt", "DESC")
      .addOrderBy("subTransactions.createdAt", "ASC")
      .getMany();
  }

  public async update(transaction: Transaction): Promise<Transaction> {
    await this.ormRepository.save(transaction);
    return this.findByIdOrFail(transaction.id);
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }

  private async findByIdOrFail(id: string): Promise<Transaction> {
    const transaction = await this.findById(id);

    if (!transaction) {
      throw new Error("Transaction persistence failure");
    }

    return transaction;
  }
}

export { TransactionsRepository };
