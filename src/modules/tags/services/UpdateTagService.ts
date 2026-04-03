import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { Tag } from "../infra/typeorm/entities/Tag.js";
import { ITagsRepository } from "../repositories/ITagsRepository.js";

interface IRequest {
  workspaceId: string;
  tagId: string;
  userId: string;
  name: string;
}

@injectable()
class UpdateTagService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: ITagsRepository
  ) {}

  public async execute({ workspaceId, tagId, userId, name }: IRequest): Promise<Tag> {
    const isMember = await this.tagsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const tag = await this.tagsRepository.findById(tagId);

    if (!tag || tag.workspaceId !== workspaceId) {
      throw new AppError("Tag not found", 404);
    }

    const duplicatedTag = await this.tagsRepository.findByWorkspaceAndName(workspaceId, name);

    if (duplicatedTag && duplicatedTag.id !== tagId) {
      throw new AppError("Tag name already in use for this workspace", 409);
    }

    tag.name = name;
    return this.tagsRepository.update(tag);
  }
}

export { UpdateTagService };
