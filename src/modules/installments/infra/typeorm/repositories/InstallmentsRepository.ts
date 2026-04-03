import { Repository } from "typeorm";
import { AppDataSource } from "../../../../../shared/infra/typeorm/data-source.js";
import { ICreateInstallmentDTO } from "../../../dtos/ICreateInstallmentDTO.js";
import { IInstallmentsRepository } from "../../../repositories/IInstallmentsRepository.js";
import { Installment } from "../entities/Installment.js";

class InstallmentsRepository implements IInstallmentsRepository {
  private ormRepository: Repository<Installment>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Installment);
  }

  public async create(data: ICreateInstallmentDTO): Promise<Installment> {
    const installment = this.ormRepository.create(data);
    await this.ormRepository.save(installment);
    return installment;
  }

  public async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await AppDataSource.getRepository("workspace_members")
      .createQueryBuilder("workspaceMember")
      .where("workspaceMember.workspaceId = :workspaceId", { workspaceId })
      .andWhere("workspaceMember.userId = :userId", { userId })
      .getRawOne();

    return !!member;
  }

  public async listByWorkspaceId(workspaceId: string): Promise<Installment[]> {
    return this.ormRepository.find({
      where: { workspaceId },
      order: { createdAt: "DESC" },
    });
  }

  public async findById(id: string): Promise<Installment | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async update(installment: Installment): Promise<Installment> {
    await this.ormRepository.save(installment);
    return installment;
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete({ id });
  }
}

export { InstallmentsRepository };
