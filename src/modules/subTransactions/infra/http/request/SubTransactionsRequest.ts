import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const subTransactionWorkspaceParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
});

const subTransactionPaginationQuerySchema = yup.object({
  page: yup.number().integer().min(1).default(1).label("page"),
  limit: yup.number().integer().min(1).max(100).default(10).label("limit"),
});

const listPaginatedSubTransactionSchema = {
  params: subTransactionWorkspaceParamsSchema,
  query: subTransactionPaginationQuerySchema,
};

export type SubTransactionWorkspaceParams = yup.InferType<
  typeof subTransactionWorkspaceParamsSchema
>;
export type SubTransactionPaginationQuery = yup.InferType<
  typeof subTransactionPaginationQuerySchema
>;

class SubTransactionsRequest {
  public async listPaginated(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, listPaginatedSubTransactionSchema);
    return next();
  }
}

export { SubTransactionsRequest };
