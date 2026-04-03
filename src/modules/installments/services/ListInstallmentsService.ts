import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Installment } from "../infra/typeorm/entities/Installment.js";
import { IInstallmentsRepository } from "../repositories/IInstallmentsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
}

@injectable()
class ListInstallmentsService {
  constructor(
    @inject("InstallmentsRepository")
    private installmentsRepository: IInstallmentsRepository
  ) {}

  public async execute({ workspaceId, userId }: IRequest): Promise<Installment[]> {
    const isMember = await this.installmentsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    return this.installmentsRepository.listByWorkspaceId(workspaceId);
  }
}

export { ListInstallmentsService };
