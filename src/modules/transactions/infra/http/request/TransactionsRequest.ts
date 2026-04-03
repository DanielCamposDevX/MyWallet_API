import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const workspaceParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
});

const transactionParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
  transactionId: yup.string().uuid().required().label("transactionId"),
});

const subTransactionSchema = yup.object({
  description: yup.string().min(2).max(255).required().label("subTransactions.description"),
  amount: yup.number().moreThan(0).required().label("subTransactions.amount"),
});

const createSimpleTransactionBodySchema = yup.object({
  type: yup.mixed<"income" | "expense">().oneOf(["income", "expense"]).required(),
  description: yup.string().min(2).max(255).required().label("description"),
  amount: yup.number().moreThan(0).required().label("amount"),
  competenceDate: yup.string().required().label("competenceDate"),
  recurrenceMonths: yup.number().integer().min(1).max(120).default(1),
  tagIds: yup.array().of(yup.string().uuid().required()).default([]),
});

const createAdvancedTransactionBodySchema = yup.object({
  type: yup.mixed<"income" | "expense">().oneOf(["income", "expense"]).required(),
  description: yup.string().min(2).max(255).required().label("description"),
  competenceDate: yup.string().required().label("competenceDate"),
  subTransactions: yup.array().of(subTransactionSchema).min(1).required(),
  tagIds: yup.array().of(yup.string().uuid().required()).default([]),
});

const updateTransactionBodySchema = yup.object({
  type: yup.mixed<"income" | "expense">().oneOf(["income", "expense"]),
  description: yup.string().min(2).max(255),
  amount: yup.number().moreThan(0),
  competenceDate: yup.string(),
  tagIds: yup.array().of(yup.string().uuid().required()),
  subTransactions: yup.array().of(subTransactionSchema).min(1),
});

const createSimpleTransactionSchema = {
  params: workspaceParamsSchema,
  body: createSimpleTransactionBodySchema,
};

const createAdvancedTransactionSchema = {
  params: workspaceParamsSchema,
  body: createAdvancedTransactionBodySchema,
};

const listTransactionQuerySchema = yup.object({
  month: yup.string().matches(/^\d{4}-(0[1-9]|1[0-2])$/, "month must follow YYYY-MM"),
});

const listTransactionSchema = {
  params: workspaceParamsSchema,
  query: listTransactionQuerySchema,
};

const updateTransactionSchema = {
  params: transactionParamsSchema,
  body: updateTransactionBodySchema,
};

const deleteTransactionSchema = {
  params: transactionParamsSchema,
};

export type WorkspaceParams = yup.InferType<typeof workspaceParamsSchema>;
export type TransactionParams = yup.InferType<typeof transactionParamsSchema>;
export type CreateSimpleTransactionBody = yup.InferType<
  typeof createSimpleTransactionBodySchema
>;
export type CreateAdvancedTransactionBody = yup.InferType<
  typeof createAdvancedTransactionBodySchema
>;
export type UpdateTransactionBody = yup.InferType<typeof updateTransactionBodySchema>;
export type ListTransactionQuery = yup.InferType<typeof listTransactionQuerySchema>;

class TransactionsRequest {
  public async createSimple(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createSimpleTransactionSchema);
    return next();
  }

  public async createAdvanced(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createAdvancedTransactionSchema);
    return next();
  }

  public async list(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, listTransactionSchema);
    return next();
  }

  public async update(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, updateTransactionSchema);
    return next();
  }

  public async delete(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, deleteTransactionSchema);
    return next();
  }
}

export { TransactionsRequest };
