import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError.js";
import { ITagsRepository } from "../repositories/ITagsRepository.js";

interface IRequest {
  workspaceId: string;
  tagId: string;
  userId: string;
}

@injectable()
class DeleteTagService {
  constructor(
    @inject("TagsRepository")
    private tagsRepository: ITagsRepository
  ) {}

  public async execute({ workspaceId, tagId, userId }: IRequest): Promise<void> {
    const isMember = await this.tagsRepository.isMember(workspaceId, userId);

    if (!isMember) {
      throw new AppError("Forbidden workspace access", 403);
    }

    const tag = await this.tagsRepository.findById(tagId);

    if (!tag || tag.workspaceId !== workspaceId) {
      throw new AppError("Tag not found", 404);
    }

    await this.tagsRepository.deleteById(tagId);
  }
}

export { DeleteTagService };
