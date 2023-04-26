import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateVotingTable1682483060163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votings',
        columns: [
          {
            name: 'voteId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'voteOptionId',
            type: 'integer',
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
            name: 'FK_voting_vote',
            columnNames: ['voteId'],
            referencedTableName: 'votes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_voting_voteOption',
            columnNames: ['voteOptionId'],
            referencedTableName: 'voteOptions',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('votings')
  }
}
