import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../infra/typeorm/entities/Tag.js";
import { ITagsRepository } from "../repositories/ITagsRepository.js";

interface IRequest {
  workspaceId: string;
  userId: string;
  name: string;
}

@injectable()
class CreateTagService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: ITagsRepository
  ) {}

  public async execute({ workspaceId, userId, name }: IRequest): Promise<Tag> {
    const isMember = await this.tagsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const tagExists = await this.tagsRepository.findByWorkspaceAndName(workspaceId, name);

    if (tagExists) {
      throw new AppError("Tag name already in use for this workspace", 409);
    }

    return this.tagsRepository.create({ workspaceId, name });
  }
}

export { CreateTagService };
