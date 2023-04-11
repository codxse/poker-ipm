import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateUserRoomsTable1681248938884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_rooms',
        columns: [
          {
            name: 'userId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'roomId',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createForeignKey(
      'user_rooms',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'user_rooms',
      new TableForeignKey({
        columnNames: ['roomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_rooms')
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    )
    const roomForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('roomId') !== -1,
    )

    await queryRunner.dropForeignKey('user_rooms', userForeignKey)
    await queryRunner.dropForeignKey('user_rooms', roomForeignKey)
    await queryRunner.dropTable('user_rooms')
  }
}
