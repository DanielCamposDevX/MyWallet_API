import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1712275200000 implements MigrationInterface {
  name = "InitialSchema1712275200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(120) NOT NULL,
        \`email\` varchar(180) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        UNIQUE INDEX \`UQ_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`workspaces\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(120) NOT NULL,
        \`mode\` enum ('private', 'link') NOT NULL DEFAULT 'private',
        \`frequency\` enum ('daily', 'weekly', 'monthly') NOT NULL,
        \`shareToken\` varchar(255) NULL,
        \`ownerId\` varchar(36) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`sessions\` (
        \`id\` varchar(36) NOT NULL,
        \`token\` varchar(255) NOT NULL,
        \`userId\` varchar(36) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`UQ_sessions_token\` (\`token\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_sessions_user\`
          FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`)
          ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`workspace_members\` (
        \`id\` varchar(36) NOT NULL,
        \`workspaceId\` varchar(36) NOT NULL,
        \`userId\` varchar(36) NOT NULL,
        \`role\` enum ('owner', 'member') NOT NULL DEFAULT 'member',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`UQ_workspace_members_workspace_user\` (\`workspaceId\`, \`userId\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_workspace_members_workspace\`
          FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`)
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_workspace_members_user\`
          FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`)
          ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`tags\` (
        \`id\` varchar(36) NOT NULL,
        \`workspaceId\` varchar(36) NOT NULL,
        \`name\` varchar(120) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`UQ_tags_workspace_name\` (\`workspaceId\`, \`name\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS `transaction_tags`");
    await queryRunner.query("DROP TABLE IF EXISTS `sub_transactions`");
    await queryRunner.query("DROP TABLE IF EXISTS `transactions`");
    await queryRunner.query("DROP TABLE IF EXISTS `tags`");
    await queryRunner.query("DROP TABLE IF EXISTS `workspace_members`");
    await queryRunner.query("DROP TABLE IF EXISTS `sessions`");
    await queryRunner.query("DROP TABLE IF EXISTS `workspaces`");
    await queryRunner.query("DROP TABLE IF EXISTS `users`");
  }
}
