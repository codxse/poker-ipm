import { Injectable } from '@nestjs/common'
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
    const room = new Room()
    room.name = createRoomDto.name
    room.createdBy = await this.userRepository.findOne({
      where: { id: createdById },
    })

    const newRoom = this.roomRepository.create(room)
    return this.roomRepository.save(newRoom)
  }
}
