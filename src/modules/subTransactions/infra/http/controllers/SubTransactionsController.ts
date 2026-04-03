import type { Request, Response } from "express";
import { container } from "tsyringe";
import { getAuthenticatedUserId } from "../../../../../shared/infra/http/types/getAuthenticatedUserId.js";
import { ListPaginatedSubTransactionsService } from "../../../services/ListPaginatedSubTransactionsService.js";
import type {
  SubTransactionPaginationQuery,
  SubTransactionWorkspaceParams,
} from "../request/SubTransactionsRequest.js";

class SubTransactionsController {
  public async indexPaginated(
    request: Request<SubTransactionWorkspaceParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { page, limit } = request.query as unknown as SubTransactionPaginationQuery;
    const userId = getAuthenticatedUserId(request);

    const listPaginatedSubTransactions = container.resolve(
      ListPaginatedSubTransactionsService
    );

    const subTransactions = await listPaginatedSubTransactions.execute({
      workspaceId,
      userId,
      page,
      limit,
    });

    return response.status(200).json(subTransactions);
  }
}

export { SubTransactionsController };
