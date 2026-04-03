import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Installment } from "../infra/typeorm/entities/Installment.js";
import { IInstallmentsRepository } from "../repositories/IInstallmentsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
  description: string;
  installmentCount: number;
  paidInstallments: number;
  installmentAmount: number;
}

@injectable()
class CreateInstallmentService {
  constructor(
    @inject("InstallmentsRepository")
    private installmentsRepository: IInstallmentsRepository
  ) {}

  public async execute(data: IRequest): Promise<Installment> {
    const isMember = await this.installmentsRepository.isMember(data.workspaceId, data.userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    if (data.installmentCount < 1) {
      throw new AppError("installmentCount must be at least 1", 400);
    }

    if (data.paidInstallments < 0) {
      throw new AppError("paidInstallments cannot be negative", 400);
    }

    if (data.paidInstallments > data.installmentCount) {
      throw new AppError("paidInstallments cannot be greater than installmentCount", 400);
    }

    if (data.installmentAmount <= 0) {
      throw new AppError("installmentAmount must be greater than 0", 400);
    }

    return this.installmentsRepository.create({
      workspaceId: data.workspaceId,
      createdByUserId: data.userId,
      description: data.description,
      installmentCount: data.installmentCount,
      paidInstallments: data.paidInstallments,
      installmentAmount: String(data.installmentAmount),
    });
  }
}

export { CreateInstallmentService };
