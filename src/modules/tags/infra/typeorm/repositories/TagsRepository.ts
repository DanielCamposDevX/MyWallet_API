import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import { ICreateTagDTO } from "../../../dtos/ICreateTagDTO.js";
import {
  ITagPaginationResult,
  ITagsRepository,
} from "../../../repositories/ITagsRepository.js";
import { Tag } from "../entities/Tag.js";

class TagsRepository implements ITagsRepository {
  private ormRepository: Repository<Tag>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Tag);
  }

  public async create(data: ICreateTagDTO): Promise<Tag> {
    const tag = this.ormRepository.create(data);
    await this.ormRepository.save(tag);
    return tag;
  }

  public async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await AppDataSource.getRepository("workspace_members")
      .createQueryBuilder("workspaceMember")
      .where("workspaceMember.workspaceId = :workspaceId", { workspaceId })
      .andWhere("workspaceMember.userId = :userId", { userId })
      .getRawOne();

    return !!member;
  }

  public async findByWorkspaceAndName(
    workspaceId: string,
    name: string
  ): Promise<Tag | null> {
    return this.ormRepository.findOne({ where: { workspaceId, name } });
  }

  public async listByWorkspaceId(workspaceId: string): Promise<Tag[]> {
    return this.ormRepository.find({ where: { workspaceId }, order: { name: "ASC" } });
  }

  public async listByWorkspaceIdPaginated(
    workspaceId: string,
    page: number,
    limit: number
  ): Promise<ITagPaginationResult> {
    const [data, total] = await this.ormRepository.findAndCount({
      where: { workspaceId },
      order: { name: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  public async findById(id: string): Promise<Tag | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findManyByIds(ids: string[]): Promise<Tag[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.ormRepository.find({ where: { id: In(ids) } });
  }

  public async update(tag: Tag): Promise<Tag> {
    await this.ormRepository.save(tag);
    return tag;
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export { TagsRepository };
