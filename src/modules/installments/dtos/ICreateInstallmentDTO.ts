interface ICreateInstallmentDTO {
  workspaceId: string;
  createdByUserId: string;
  description: string;
  installmentCount: number;
  paidInstallments: number;
}

export { ICreateInstallmentDTO };
