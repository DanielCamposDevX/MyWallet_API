interface ICreateInstallmentDTO {
  workspaceId: string;
  createdByUserId: string;
  description: string;
  installmentCount: number;
  paidInstallments: number;
  installmentAmount: string;
}

export { ICreateInstallmentDTO };
