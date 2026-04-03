import { injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { AppDataSource } from "../../../shared/infra/typeorm/data-source.js";
import { buildMonthRange } from "../../../shared/utils/date/monthRange.js";

type DashboardExpenseByTag = {
  tagId: string;
  tagName: string;
  totalAmount: string;
};

type DashboardSubTransaction = {
  id: string;
  description: string;
  amount: string;
  transactionId: string;
  transactionDescription: string;
  transactionType: "income" | "expense";
  competenceDate: string;
  tags: Array<{ id: string; name: string }>;
};

type DashboardResponse = {
  month: string;
  remainingInMonth: string;
  installmentsTotalInMonth: string;
  expensesByTag: DashboardExpenseByTag[];
  subTransactions: DashboardSubTransaction[];
};

interface IRequest {
  workspaceId: string;
  userId: string;
  month: string;
  tagId?: string;
}

@injectable()
class GetWorkspaceDashboardService {
  public async execute({
    workspaceId,
    userId,
    month,
    tagId,
  }: IRequest): Promise<DashboardResponse> {
    const isMember = await AppDataSource.getRepository("workspace_members")
      .createQueryBuilder("workspaceMember")
      .where("workspaceMember.workspaceId = :workspaceId", { workspaceId })
      .andWhere("workspaceMember.userId = :userId", { userId })
      .getRawOne();

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const {
      month: normalizedMonth,
      startDate,
      endDate,
    } = buildMonthRange(month);

    const incomeRaw = await AppDataSource.getRepository("transactions")
      .createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "total")
      .where("transaction.workspaceId = :workspaceId", { workspaceId })
      .andWhere("transaction.type = :type", { type: "income" })
      .andWhere("transaction.competenceDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getRawOne<{ total: string }>();

    const expenseRaw = await AppDataSource.getRepository("transactions")
      .createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "total")
      .where("transaction.workspaceId = :workspaceId", { workspaceId })
      .andWhere("transaction.type = :type", { type: "expense" })
      .andWhere("transaction.competenceDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getRawOne<{ total: string }>();

    const installmentsRaw = await AppDataSource.getRepository("installments")
      .createQueryBuilder("installment")
      .select("COALESCE(SUM(installment.installmentAmount), 0)", "total")
      .where("installment.workspaceId = :workspaceId", { workspaceId })
      .andWhere("DATE(installment.createdAt) BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getRawOne<{ total: string }>();

    const expensesByTagRaw = await AppDataSource.getRepository("transactions")
      .createQueryBuilder("transaction")
      .innerJoin(
        "transaction_tags",
        "transactionTag",
        "transactionTag.transactionId = transaction.id"
      )
      .innerJoin("tags", "tag", "tag.id = transactionTag.tagId")
      .select("tag.id", "tagId")
      .addSelect("tag.name", "tagName")
      .addSelect("COALESCE(SUM(transaction.amount), 0)", "totalAmount")
      .where("transaction.workspaceId = :workspaceId", { workspaceId })
      .andWhere("transaction.type = :type", { type: "expense" })
      .andWhere("transaction.competenceDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .groupBy("tag.id")
      .addGroupBy("tag.name")
      .orderBy("SUM(transaction.amount)", "DESC")
      .getRawMany<DashboardExpenseByTag>();

    const subTransactionsQuery = AppDataSource.getRepository("sub_transactions")
      .createQueryBuilder("subTransaction")
      .innerJoin(
        "transactions",
        "transaction",
        "transaction.id = subTransaction.transactionId"
      )
      .leftJoin(
        "transaction_tags",
        "transactionTag",
        "transactionTag.transactionId = transaction.id"
      )
      .leftJoin("tags", "tag", "tag.id = transactionTag.tagId")
      .select("subTransaction.id", "subTransactionId")
      .addSelect("subTransaction.description", "subTransactionDescription")
      .addSelect("subTransaction.amount", "subTransactionAmount")
      .addSelect("transaction.id", "transactionId")
      .addSelect("transaction.description", "transactionDescription")
      .addSelect("transaction.type", "transactionType")
      .addSelect("transaction.competenceDate", "competenceDate")
      .addSelect("tag.id", "tagId")
      .addSelect("tag.name", "tagName")
      .where("transaction.workspaceId = :workspaceId", { workspaceId })
      .andWhere("transaction.competenceDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("transaction.competenceDate", "DESC")
      .addOrderBy("subTransaction.createdAt", "DESC");

    if (tagId) {
      subTransactionsQuery.andWhere("tag.id = :tagId", { tagId });
    }

    const subTransactionsRows = await subTransactionsQuery.getRawMany<{
      subTransactionId: string;
      subTransactionDescription: string;
      subTransactionAmount: string;
      transactionId: string;
      transactionDescription: string;
      transactionType: "income" | "expense";
      competenceDate: string;
      tagId: string | null;
      tagName: string | null;
    }>();

    const subTransactionsMap = new Map<string, DashboardSubTransaction>();

    for (const row of subTransactionsRows) {
      const existing = subTransactionsMap.get(row.subTransactionId);

      if (!existing) {
        subTransactionsMap.set(row.subTransactionId, {
          id: row.subTransactionId,
          description: row.subTransactionDescription,
          amount: String(row.subTransactionAmount),
          transactionId: row.transactionId,
          transactionDescription: row.transactionDescription,
          transactionType: row.transactionType,
          competenceDate: row.competenceDate,
          tags: row.tagId ? [{ id: row.tagId, name: row.tagName ?? "" }] : [],
        });
        continue;
      }

      if (row.tagId && !existing.tags.some((tag) => tag.id === row.tagId)) {
        existing.tags.push({ id: row.tagId, name: row.tagName ?? "" });
      }
    }

    const incomeAmount = Number(incomeRaw?.total ?? 0);
    const expenseAmount = Number(expenseRaw?.total ?? 0);

    return {
      month: normalizedMonth,
      remainingInMonth: (
        incomeAmount -
        expenseAmount -
        Number(installmentsRaw?.total ?? 0)
      ).toFixed(2),
      installmentsTotalInMonth: Number(installmentsRaw?.total ?? 0).toFixed(2),
      expensesByTag: expensesByTagRaw.map((item) => ({
        ...item,
        totalAmount: Number(item.totalAmount ?? 0).toFixed(2),
      })),
      subTransactions: Array.from(subTransactionsMap.values()),
    };
  }
}

export { GetWorkspaceDashboardService };
