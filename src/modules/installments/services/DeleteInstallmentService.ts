import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { IInstallmentsRepository } from "../repositories/IInstallmentsRepository.js";

interface IRequest {
  workspaceId: string;
  installmentId: string;
  userId: string;
}

@injectable()
class DeleteInstallmentService {
  constructor(
    @inject("InstallmentsRepository")
    private installmentsRepository: IInstallmentsRepository
  ) {}

  public async execute({ workspaceId, installmentId, userId }: IRequest): Promise<void> {
    const isMember = await this.installmentsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const installment = await this.installmentsRepository.findById(installmentId);

    if (!installment || installment.workspaceId !== workspaceId) {
      throw new AppError("Installment not found", 404);
    }

    await this.installmentsRepository.deleteById(installmentId);
  }
}

export { DeleteInstallmentService };
