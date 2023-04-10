import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class MigrationsAddIsVerifiedToUsersTable1681087938909
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const isVerifiedColumn = new TableColumn({
      name: 'isVerified',
      type: 'boolean',
      default: false,
    })

    await queryRunner.addColumn('users', isVerifiedColumn)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'isVerified')
  }
}
