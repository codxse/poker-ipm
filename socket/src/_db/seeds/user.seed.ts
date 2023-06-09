import { DataSource } from 'typeorm'
import { User } from '@app/entities/user.entity'
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedUsers(
  connection: DataSource,
  totalGeneratedUsers = 2,
): Promise<User[]> {
  const usersToSeed: Partial<User>[] = []

  for (let i = 0; i < totalGeneratedUsers; i++) {
    usersToSeed.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      avatarUrl: faker.internet.avatar(),
      password: faker.internet.password(),
      isVerified: true,
    })
  }

  const userRepository = connection.getRepository(User)
  return await userRepository.save(usersToSeed)
}
