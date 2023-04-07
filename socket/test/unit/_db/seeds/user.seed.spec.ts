import { DataSource } from 'typeorm';
import { createTestingConnections, closeTestingConnections } from '@testhelper/testing';
import { User } from '@app/entities/user.entity';
import { seedUsers } from '@app/_db/seeds/user.seed';

describe('UserSeed', () => {
  let connection: DataSource;

  beforeAll(async () => {
    [connection] = await createTestingConnections();
  });

  afterAll(async () => {
    await closeTestingConnections([connection]);
  });

  it('should seed users', async () => {
    await seedUsers(connection);

    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    expect(users.length).toBeGreaterThan(0);
  });
});