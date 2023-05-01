import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateVotingTable1682483060163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'votings',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'votedById',
            type: 'bigint',
          },
          {
            name: 'storyId',
            type: 'bigint',
          },
          {
            name: 'voteOptionId',
            type: 'bigint',
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
            columnNames: ['votedById', 'storyId'],
            referencedTableName: 'votes',
            referencedColumnNames: ['votedById', 'storyId'],
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
