import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const installmentWorkspaceParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
});

const installmentParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
  installmentId: yup.string().uuid().required().label("installmentId"),
});

const createInstallmentBodySchema = yup.object({
  description: yup.string().min(2).max(255).required().label("description"),
  installmentCount: yup.number().integer().min(1).required().label("installmentCount"),
  paidInstallments: yup.number().integer().min(0).required().label("paidInstallments"),
});

const updateInstallmentBodySchema = yup.object({
  description: yup.string().min(2).max(255),
  installmentCount: yup.number().integer().min(1),
  paidInstallments: yup.number().integer().min(0),
});

const createInstallmentSchema = {
  params: installmentWorkspaceParamsSchema,
  body: createInstallmentBodySchema,
};

const listInstallmentSchema = {
  params: installmentWorkspaceParamsSchema,
};

const updateInstallmentSchema = {
  params: installmentParamsSchema,
  body: updateInstallmentBodySchema,
};

const deleteInstallmentSchema = {
  params: installmentParamsSchema,
};

export type InstallmentWorkspaceParams = yup.InferType<
  typeof installmentWorkspaceParamsSchema
>;
export type InstallmentParams = yup.InferType<typeof installmentParamsSchema>;
export type CreateInstallmentBody = yup.InferType<typeof createInstallmentBodySchema>;
export type UpdateInstallmentBody = yup.InferType<typeof updateInstallmentBodySchema>;

class InstallmentsRequest {
  public async create(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createInstallmentSchema);
    return next();
  }

  public async list(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, listInstallmentSchema);
    return next();
  }

  public async update(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, updateInstallmentSchema);
    return next();
  }

  public async delete(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, deleteInstallmentSchema);
    return next();
  }
}

export { InstallmentsRequest };
