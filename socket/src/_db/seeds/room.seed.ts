import { DataSource } from 'typeorm'
import { Room } from '@app/entities/room.entity'
import { User } from '@app/entities/user.entity'
import { faker } from '@faker-js/faker/locale/id_ID'

export async function seedRooms(
  connection: DataSource,
  createdByUser: User,
  totalGeneratedRooms = 2,
): Promise<Room[]> {
  const roomsToSeed: Partial<Room>[] = []

  for (let i = 0; i < totalGeneratedRooms; i++) {
    roomsToSeed.push({
      name: faker.company.name(),
      createdBy: createdByUser,
    })
  }

  const roomRepository = connection.getRepository(Room)
  return await roomRepository.save(roomsToSeed)
}
