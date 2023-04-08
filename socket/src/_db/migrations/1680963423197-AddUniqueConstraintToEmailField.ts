import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm'

export class AddUniqueConstraintToEmailField1680963423197
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        name: 'UQ_EMAIL',
        columnNames: ['email'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('users', 'UQ_EMAIL')
  }
}
