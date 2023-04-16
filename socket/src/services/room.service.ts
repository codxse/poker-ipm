import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { CreateRoomDto } from '@app/dto/create-room.dto'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRoomDto: CreateRoomDto, createdById: number) {
    const createdBy = await this.userRepository.findOne({
      where: {
        id: createdById,
      },
      relations: ['joins'],
    })

    if (!createdBy) {
      throw new NotFoundException('User not found')
    }

    const room = new Room()
    room.name = createRoomDto.name
    room.createdBy = createdBy
    room.users = [createdBy]

    const newRoom = this.roomRepository.create(room)
    return this.roomRepository.save(newRoom)
  }

  async join(roomId: number, userId: number) {
    const room = await this.roomRepository.findOneBy({ id: roomId })
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!room) throw new NotFoundException(`Room with id ${roomId} not found`)
    if (!user) throw new NotFoundException(`User with id ${userId} not found`)

    user.joins.push(room)

    await this.userRepository.save(user)
    return room
  }
}
