import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, QueryRunner } from 'typeorm'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { ParticipantService } from '@app/services//participant.service'
import { JoinAs, Participant } from '@app/entities/participant.entity'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly participantService: ParticipantService,
  ) {}

  async create(
    createRoomDto: CreateRoomDto,
    createdById: number,
    joinAs: JoinAs.OBSERVABLE,
  ) {
    const queryRunner: QueryRunner =
      this.roomRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
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
      const newRoom = await this.roomRepository.create(room)
      const savedNewRoom = await this.roomRepository.save(newRoom)

      const participant = await this.createParticipantIfNotExist(
        createdById,
        savedNewRoom.id,
        joinAs,
      )

      savedNewRoom.participants = [participant]

      return savedNewRoom
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async join(
    roomId: number,
    userId: number,
    joinAs: JoinAs = JoinAs.OBSERVABLE,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) throw new NotFoundException(`User with id ${userId} not found`)

    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['users'],
    })

    if (!room) throw new NotFoundException(`Room with id ${roomId} not found`)

    const existingParticipant = room.participants.find(
      (participant) => participant.user.id === userId,
    )

    if (existingParticipant) return room

    const participant: Participant = await this.participantService.create(
      userId,
      roomId,
      joinAs,
    )
    room.participants.push(participant)

    await this.roomRepository.save(room)
    return room
  }

  private async createParticipantIfNotExist(
    userId: number,
    roomId: number,
    joinAs: JoinAs,
  ) {
    const existingParticipant = await this.participantService.findById(
      userId,
      roomId,
    )

    if (existingParticipant) return existingParticipant

    return this.participantService.create(userId, roomId, joinAs)
  }
}
