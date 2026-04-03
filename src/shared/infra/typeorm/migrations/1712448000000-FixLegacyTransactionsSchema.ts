import { MigrationInterface, QueryRunner } from "typeorm";

export class FixLegacyTransactionsSchema1712448000000 implements MigrationInterface {
  name = "FixLegacyTransactionsSchema1712448000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTransactionsTable = await queryRunner.hasTable("transactions");

    if (!hasTransactionsTable) {
      return;
    }

    const rawColumns = await queryRunner.query("SHOW COLUMNS FROM `transactions`");
    const columnNames = new Set<string>(rawColumns.map((column: { Field: string }) => column.Field));
    const hasCurrentSchema =
      columnNames.has("workspaceId") &&
      columnNames.has("createdByUserId") &&
      columnNames.has("competenceDate") &&
      columnNames.has("recurringGroupId") &&
      columnNames.has("updatedAt");

    if (hasCurrentSchema) {
      return;
    }

    const hasLegacySchema =
      columnNames.has("value") && columnNames.has("date") && columnNames.has("userId");

    if (!hasLegacySchema) {
      return;
    }

    await queryRunner.query("DROP TABLE IF EXISTS `transaction_tags`");
    await queryRunner.query("DROP TABLE IF EXISTS `sub_transactions`");
    await queryRunner.query("DROP TABLE IF EXISTS `transactions`");

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`transactions\` (
        \`id\` varchar(36) NOT NULL,
        \`workspaceId\` varchar(36) NOT NULL,
        \`createdByUserId\` varchar(36) NOT NULL,
        \`type\` enum ('income', 'expense') NOT NULL,
        \`format\` enum ('simple', 'advanced') NOT NULL,
        \`description\` varchar(255) NOT NULL,
        \`amount\` decimal(12,2) NOT NULL,
        \`competenceDate\` date NOT NULL,
        \`recurringGroupId\` varchar(36) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`sub_transactions\` (
        \`id\` varchar(36) NOT NULL,
        \`transactionId\` varchar(36) NOT NULL,
        \`description\` varchar(255) NOT NULL,
        \`amount\` decimal(12,2) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_sub_transactions_transaction\`
          FOREIGN KEY (\`transactionId\`) REFERENCES \`transactions\`(\`id\`)
          ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`transaction_tags\` (
        \`transactionId\` varchar(36) NOT NULL,
        \`tagId\` varchar(36) NOT NULL,
        INDEX \`IDX_transaction_tags_transaction\` (\`transactionId\`),
        INDEX \`IDX_transaction_tags_tag\` (\`tagId\`),
        PRIMARY KEY (\`transactionId\`, \`tagId\`),
        CONSTRAINT \`FK_transaction_tags_transaction\`
          FOREIGN KEY (\`transactionId\`) REFERENCES \`transactions\`(\`id\`)
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_transaction_tags_tag\`
          FOREIGN KEY (\`tagId\`) REFERENCES \`tags\`(\`id\`)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(): Promise<void> {
    // Irreversible migration: legacy and current schemas are not equivalent.
  }
}
