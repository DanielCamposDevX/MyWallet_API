import { InitialSchema1712275200000 } from "./1712275200000-InitialSchema.js";
import { CreateInstallmentsTable1712361600000 } from "./1712361600000-CreateInstallmentsTable.js";
import { FixLegacyTransactionsSchema1712448000000 } from "./1712448000000-FixLegacyTransactionsSchema.js";
import { AddInstallmentAmountToInstallments1712534400000 } from "./1712534400000-AddInstallmentAmountToInstallments.js";

const migrations = [
  InitialSchema1712275200000,
  CreateInstallmentsTable1712361600000,
  FixLegacyTransactionsSchema1712448000000,
  AddInstallmentAmountToInstallments1712534400000,
];

export { migrations };
