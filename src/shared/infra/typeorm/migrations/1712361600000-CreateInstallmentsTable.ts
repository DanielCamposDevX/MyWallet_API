import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInstallmentsTable1712361600000 implements MigrationInterface {
  name = "CreateInstallmentsTable1712361600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`installments\` (
        \`id\` varchar(36) NOT NULL,
        \`workspaceId\` varchar(36) NOT NULL,
        \`createdByUserId\` varchar(36) NOT NULL,
        \`description\` varchar(255) NOT NULL,
        \`installmentCount\` int UNSIGNED NOT NULL,
        \`paidInstallments\` int UNSIGNED NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_installments_workspaceId\` (\`workspaceId\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS `installments`");
  }
}
