import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Installment } from "../infra/typeorm/entities/Installment.js";
import { IInstallmentsRepository } from "../repositories/IInstallmentsRepository.js";

interface IRequest {
  workspaceId: string;
  installmentId: string;
  userId: string;
  description?: string;
  installmentCount?: number;
  paidInstallments?: number;
}

@injectable()
class UpdateInstallmentService {
  constructor(
    @inject("InstallmentsRepository")
    private installmentsRepository: IInstallmentsRepository
  ) {}

  public async execute(data: IRequest): Promise<Installment> {
    const isMember = await this.installmentsRepository.isMember(data.workspaceId, data.userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const installment = await this.installmentsRepository.findById(data.installmentId);

    if (!installment || installment.workspaceId !== data.workspaceId) {
      throw new AppError("Installment not found", 404);
    }

    if (data.description !== undefined) {
      installment.description = data.description;
    }

    const nextInstallmentCount = data.installmentCount ?? installment.installmentCount;
    const nextPaidInstallments = data.paidInstallments ?? installment.paidInstallments;

    if (nextInstallmentCount < 1) {
      throw new AppError("installmentCount must be at least 1", 400);
    }

    if (nextPaidInstallments < 0) {
      throw new AppError("paidInstallments cannot be negative", 400);
    }

    if (nextPaidInstallments > nextInstallmentCount) {
      throw new AppError("paidInstallments cannot be greater than installmentCount", 400);
    }

    installment.installmentCount = nextInstallmentCount;
    installment.paidInstallments = nextPaidInstallments;

    return this.installmentsRepository.update(installment);
  }
}

export { UpdateInstallmentService };
