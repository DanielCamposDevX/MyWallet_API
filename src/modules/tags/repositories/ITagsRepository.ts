import { ICreateTagDTO } from "../dtos/ICreateTagDTO.js";
import { Tag } from "../infra/typeorm/entities/Tag.js";

interface ITagPaginationResult {
  data: Tag[];
  total: number;
}

interface ITagsRepository {
  create(data: ICreateTagDTO): Promise<Tag>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  findByWorkspaceAndName(workspaceId: string, name: string): Promise<Tag | null>;
  listByWorkspaceId(workspaceId: string): Promise<Tag[]>;
  listByWorkspaceIdPaginated(
    workspaceId: string,
    page: number,
    limit: number
  ): Promise<ITagPaginationResult>;
  findById(id: string): Promise<Tag | null>;
  findManyByIds(ids: string[]): Promise<Tag[]>;
  update(tag: Tag): Promise<Tag>;
  deleteById(id: string): Promise<void>;
}

export { ITagPaginationResult, ITagsRepository };
