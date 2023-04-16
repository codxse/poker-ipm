import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateParticipantsTable1681771651804
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'participants',
        columns: [
          {
            name: 'userId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'roomId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'joinAs',
            type: 'enum',
            enum: ['observer', 'observable'],
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['roomId'],
            referencedTableName: 'rooms',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('participants')
  }
}
