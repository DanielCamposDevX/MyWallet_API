interface ICreateSimpleTransactionDTO {
  workspaceId: string;
  createdByUserId: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  competenceDate: string;
  recurrenceMonths: number;
  tagIds: string[];
}

export { ICreateSimpleTransactionDTO };
