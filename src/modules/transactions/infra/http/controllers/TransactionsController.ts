import type { Request, Response } from "express";
import { container } from "tsyringe";
import { getAuthenticatedUserId } from "../../../../../shared/infra/http/types/getAuthenticatedUserId.js";
import { CreateAdvancedTransactionService } from "../../../services/CreateAdvancedTransactionService.js";
import { CreateSimpleTransactionService } from "../../../services/CreateSimpleTransactionService.js";
import { DeleteTransactionService } from "../../../services/DeleteTransactionService.js";
import { ListTransactionsService } from "../../../services/ListTransactionsService.js";
import { UpdateTransactionService } from "../../../services/UpdateTransactionService.js";
import type {
  CreateAdvancedTransactionBody,
  CreateSimpleTransactionBody,
  TransactionParams,
  UpdateTransactionBody,
  WorkspaceParams,
} from "../request/TransactionsRequest.js";

class TransactionsController {
  public async createSimple(
    request: Request<WorkspaceParams, unknown, CreateSimpleTransactionBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { type, description, amount, competenceDate, recurrenceMonths = 1, tagIds = [] } =
      request.body;
    const userId = getAuthenticatedUserId(request);

    const createSimpleTransaction = container.resolve(CreateSimpleTransactionService);
    const transactions = await createSimpleTransaction.execute({
      workspaceId,
      createdByUserId: userId,
      type,
      description,
      amount,
      competenceDate,
      recurrenceMonths,
      tagIds,
    });

    return response.status(201).json(transactions);
  }

  public async createAdvanced(
    request: Request<WorkspaceParams, unknown, CreateAdvancedTransactionBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { type, description, competenceDate, subTransactions, tagIds = [] } =
      request.body;
    const userId = getAuthenticatedUserId(request);

    const createAdvancedTransaction = container.resolve(CreateAdvancedTransactionService);
    const transaction = await createAdvancedTransaction.execute({
      workspaceId,
      createdByUserId: userId,
      type,
      description,
      competenceDate,
      subTransactions,
      tagIds,
    });

    return response.status(201).json(transaction);
  }

  public async index(
    request: Request<WorkspaceParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const listTransactions = container.resolve(ListTransactionsService);
    const transactions = await listTransactions.execute({ workspaceId, userId });

    return response.status(200).json(transactions);
  }

  public async update(
    request: Request<TransactionParams, unknown, UpdateTransactionBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId, transactionId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const updateTransaction = container.resolve(UpdateTransactionService);
    const transaction = await updateTransaction.execute({
      workspaceId,
      transactionId,
      userId,
      ...request.body,
    });

    return response.status(200).json(transaction);
  }

  public async delete(
    request: Request<TransactionParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId, transactionId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const deleteTransaction = container.resolve(DeleteTransactionService);
    await deleteTransaction.execute({ workspaceId, transactionId, userId });

    return response.status(204).send();
  }
}

export { TransactionsController };
