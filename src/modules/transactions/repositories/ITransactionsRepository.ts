import { Tag } from "../../tags/infra/typeorm/entities/Tag.js";
import { ISubTransactionCreateData } from "../../subTransactions/repositories/ISubTransactionsRepository.js";
import { Transaction } from "../infra/typeorm/entities/Transaction.js";

interface ITransactionCreateData {
  workspaceId: string;
  createdByUserId: string;
  type: "income" | "expense";
  format: "simple" | "advanced";
  description: string;
  amount: string;
  competenceDate: string;
  recurringGroupId: string | null;
  tags: Tag[];
}

interface ITransactionsRepository {
  create(data: ITransactionCreateData): Promise<Transaction>;
  createMany(data: ITransactionCreateData[]): Promise<Transaction[]>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  findTagsByIds(ids: string[]): Promise<Tag[]>;
  replaceSubTransactions(
    transactionId: string,
    subTransactions: ISubTransactionCreateData[]
  ): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  listByWorkspaceId(workspaceId: string): Promise<Transaction[]>;
  update(transaction: Transaction): Promise<Transaction>;
  deleteById(id: string): Promise<void>;
}

export { ITransactionCreateData, ITransactionsRepository };
