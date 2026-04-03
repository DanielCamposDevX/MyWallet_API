import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../infra/typeorm/entities/Tag.js";
import { ITagsRepository } from "../repositories/ITagsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
}

@injectable()
class ListTagsService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: ITagsRepository
  ) {}

  public async execute({ workspaceId, userId }: IRequest): Promise<Tag[]> {
    const isMember = await this.tagsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    return this.tagsRepository.listByWorkspaceId(workspaceId);
  }
}

export { ListTagsService };
