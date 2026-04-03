import { inject, injectable } from "tsyringe";
import { IPaginatedResponse } from "../../../shared/dtos/IPaginatedResponse.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../infra/typeorm/entities/Tag.js";
import { ITagsRepository } from "../repositories/ITagsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
  page: number;
  limit: number;
}

@injectable()
class ListPaginatedTagsService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: ITagsRepository
  ) {}

  public async execute({ workspaceId, userId, page, limit }: IRequest): Promise<IPaginatedResponse<Tag>> {
    const isMember = await this.tagsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const { data, total } = await this.tagsRepository.listByWorkspaceIdPaginated(
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

export { ListPaginatedTagsService };
