import { SubTransaction } from "../infra/typeorm/entities/SubTransaction.js";

interface ISubTransactionCreateData {
  description: string;
  amount: string;
}

interface ISubTransactionPaginationResult {
  data: SubTransaction[];
  total: number;
}

interface ISubTransactionsRepository {
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  replaceByTransactionId(
    transactionId: string,
    subTransactions: ISubTransactionCreateData[]
  ): Promise<SubTransaction[]>;
  listByWorkspaceIdPaginated(
    workspaceId: string,
    page: number,
    limit: number
  ): Promise<ISubTransactionPaginationResult>;
}

export {
  ISubTransactionCreateData,
  ISubTransactionPaginationResult,
  ISubTransactionsRepository,
};
