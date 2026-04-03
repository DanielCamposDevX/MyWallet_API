interface ISubTransactionInput {
  description: string;
  amount: number;
}

interface ICreateAdvancedTransactionDTO {
  workspaceId: string;
  createdByUserId: string;
  type: "income" | "expense";
  description: string;
  competenceDate: string;
  subTransactions: ISubTransactionInput[];
  tagIds: string[];
}

export { ICreateAdvancedTransactionDTO, ISubTransactionInput };
