import type { Request, Response } from "express";
import { container } from "tsyringe";
import { getAuthenticatedUserId } from "../../../../../shared/infra/http/types/getAuthenticatedUserId.js";
import { CreateInstallmentService } from "../../../services/CreateInstallmentService.js";
import { DeleteInstallmentService } from "../../../services/DeleteInstallmentService.js";
import { ListInstallmentsService } from "../../../services/ListInstallmentsService.js";
import { UpdateInstallmentService } from "../../../services/UpdateInstallmentService.js";
import type {
  CreateInstallmentBody,
  ListInstallmentQuery,
  InstallmentParams,
  InstallmentWorkspaceParams,
  UpdateInstallmentBody,
} from "../request/InstallmentsRequest.js";

class InstallmentsController {
  public async create(
    request: Request<InstallmentWorkspaceParams, unknown, CreateInstallmentBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { description, installmentCount, paidInstallments, installmentAmount } = request.body;
    const userId = getAuthenticatedUserId(request);

    const createInstallment = container.resolve(CreateInstallmentService);
    const installment = await createInstallment.execute({
      workspaceId,
      userId,
      description,
      installmentCount,
      paidInstallments,
      installmentAmount,
    });

    return response.status(201).json(installment);
  }

  public async index(
    request: Request<InstallmentWorkspaceParams, unknown, unknown, ListInstallmentQuery>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { month } = request.query;
    const userId = getAuthenticatedUserId(request);

    const listInstallments = container.resolve(ListInstallmentsService);
    const installments = await listInstallments.execute({ workspaceId, userId, month });

    return response.status(200).json(installments);
  }

  public async update(
    request: Request<InstallmentParams, unknown, UpdateInstallmentBody>,
    response: Response
  ): Promise<Response> {
    const { workspaceId, installmentId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const updateInstallment = container.resolve(UpdateInstallmentService);
    const installment = await updateInstallment.execute({
      workspaceId,
      installmentId,
      userId,
      ...request.body,
    });

    return response.status(200).json(installment);
  }

  public async delete(
    request: Request<InstallmentParams>,
    response: Response
  ): Promise<Response> {
    const { workspaceId, installmentId } = request.params;
    const userId = getAuthenticatedUserId(request);

    const deleteInstallment = container.resolve(DeleteInstallmentService);
    await deleteInstallment.execute({ workspaceId, installmentId, userId });

    return response.status(204).send();
  }
}

export { InstallmentsController };
