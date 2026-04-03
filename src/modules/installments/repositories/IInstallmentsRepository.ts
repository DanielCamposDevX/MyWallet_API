import { ICreateInstallmentDTO } from "../dtos/ICreateInstallmentDTO.js";
import { Installment } from "../infra/typeorm/entities/Installment.js";

interface IInstallmentsRepository {
  create(data: ICreateInstallmentDTO): Promise<Installment>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  listByWorkspaceId(workspaceId: string, month?: string): Promise<Installment[]>;
  findById(id: string): Promise<Installment | null>;
  update(installment: Installment): Promise<Installment>;
  deleteById(id: string): Promise<void>;
}

export { IInstallmentsRepository };
