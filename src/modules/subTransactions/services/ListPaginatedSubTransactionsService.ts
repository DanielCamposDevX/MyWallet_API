import { inject, injectable } from "tsyringe";
import { IPaginatedResponse } from "../../../shared/dtos/IPaginatedResponse.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { SubTransaction } from "../infra/typeorm/entities/SubTransaction.js";
import { ISubTransactionsRepository } from "../repositories/ISubTransactionsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
  page: number;
  limit: number;
}

@injectable()
class ListPaginatedSubTransactionsService {
  constructor(
    @inject("SubTransactionsRepository")
    private subTransactionsRepository: ISubTransactionsRepository
  ) {}

  public async execute({
    workspaceId,
    userId,
    page,
    limit,
  }: IRequest): Promise<IPaginatedResponse<SubTransaction>> {
    const isMember = await this.subTransactionsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const { data, total } = await this.subTransactionsRepository.listByWorkspaceIdPaginated(
      workspaceId,
      page,
      limit
    );

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}

export { ListPaginatedSubTransactionsService };
