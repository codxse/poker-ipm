import { DataSource } from 'typeorm'
import {
  createTestingConnections,
  closeTestingConnections,
} from '@testhelper/testing'
import { User } from '@app/entities/user.entity'
import { seedUsers } from '@app/_db/seeds/user.seed'

describe('UserSeed', () => {
  let connection: DataSource

  beforeAll(async () => {
    ;[connection] = await createTestingConnections()
  })

  afterAll(async () => {
    await closeTestingConnections([connection])
  })

  beforeEach(async () => {
    await connection.getRepository(User).clear()
  })

  it('should return seeded users', async () => {
    const [user] = await seedUsers(connection, 1)

    expect(user.id).not.toBe(undefined)
  })

  it('should seed specified number of users', async () => {
    await seedUsers(connection, 5)
    const users = await connection.getRepository(User).find()
    expect(users.length).toBe(5)
  })

  it('should seed default number of users when totalGeneratedUsers is not provided', async () => {
    await seedUsers(connection)
    const users = await connection.getRepository(User).find()
    expect(users.length).toBe(2)
  })
})
