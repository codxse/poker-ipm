import { DataSource } from 'typeorm'
import {
  createTestingConnections,
  closeTestingConnections,
} from '@testhelper/testing'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { seedUsers } from '@app/_db/seeds/user.seed'
import { seedRooms } from '@app/_db/seeds/room.seed'

describe('RoomSeed', () => {
  let connection: DataSource
  let user: User

  beforeAll(async () => {
    ;[connection] = await createTestingConnections()
    ;[user] = await seedUsers(connection, 1)
  })

  afterAll(async () => {
    await closeTestingConnections([connection])
  })

  beforeEach(async () => {
    const queryRunner = connection.createQueryRunner()
    await queryRunner.query('TRUNCATE rooms RESTART IDENTITY CASCADE')
  })

  it('should return seeded rooms', async () => {
    const [room] = await seedRooms(connection, user, 1)

    expect(room.id).not.toBe(undefined)
  })

  it('should seed specified number of rooms', async () => {
    await seedRooms(connection, user, 5)
    const rooms = await connection.getRepository(Room).find()

    expect(rooms.length).toBe(5)
  })

  it('should seed default number of rooms when totalGeneratedRooms is not provided', async () => {
    await seedRooms(connection, user)
    const rooms = await connection.getRepository(Room).find()

    expect(rooms.length).toBe(2)
  })
})
