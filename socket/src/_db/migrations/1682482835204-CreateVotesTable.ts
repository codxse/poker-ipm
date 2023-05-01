import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateVotesTable1682482835204 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votes',
        columns: [
          {
            name: 'votedById',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'storyId',
            type: 'bigint',
            isPrimary: true,
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
            name: 'FK_vote_votedBy',
            columnNames: ['votedById'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_vote_story',
            columnNames: ['storyId'],
            referencedTableName: 'stories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votes')
  }
}
