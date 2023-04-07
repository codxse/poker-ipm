import { DataSource } from 'typeorm';
import { User } from '@app/entities/user.entity';

export async function seedUsers(connection: DataSource): Promise<void> {
  const usersToSeed: Partial<User>[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password',
    },
  ];

  const userRepository = connection.getRepository(User);
  await userRepository.save(usersToSeed);
}