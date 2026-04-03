import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInstallmentAmountToInstallments1712534400000 implements MigrationInterface {
  name = "AddInstallmentAmountToInstallments1712534400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasInstallmentsTable = await queryRunner.hasTable("installments");

    if (!hasInstallmentsTable) {
      return;
    }

    const rawColumns = await queryRunner.query("SHOW COLUMNS FROM `installments`");
    const hasInstallmentAmount = rawColumns.some(
      (column: { Field: string }) => column.Field === "installmentAmount"
    );

    if (hasInstallmentAmount) {
      return;
    }

    await queryRunner.query(
      "ALTER TABLE `installments` ADD `installmentAmount` decimal(12,2) NOT NULL DEFAULT '0.00'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasInstallmentsTable = await queryRunner.hasTable("installments");

    if (!hasInstallmentsTable) {
      return;
    }

    const rawColumns = await queryRunner.query("SHOW COLUMNS FROM `installments`");
    const hasInstallmentAmount = rawColumns.some(
      (column: { Field: string }) => column.Field === "installmentAmount"
    );

    if (!hasInstallmentAmount) {
      return;
    }

    await queryRunner.query("ALTER TABLE `installments` DROP COLUMN `installmentAmount`");
  }
}
