import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { ParticipantService } from '@app/services/participant.service'
import { VoteOptionService } from '@app/services/vote-option.service'
import { JoinAs, Participant } from '@app/entities/participant.entity'
import { EntityManager } from 'typeorm'
import { Transactional } from '@app/decorators/transactional.decorator'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly participantService: ParticipantService,

    private readonly voteOptionService: VoteOptionService,

    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  async findById(id: number) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: {
        voteOptions: true,
        stories: { votes: { votings: true } },
        participants: { user: true },
      },
      order: { stories: { createdAt: 'DESC' } },
    })

    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`)
    }

    return room
  }

  @Transactional()
  async create(createRoomDto: CreateRoomDto, createdById: number) {
    const createdBy = await this.userRepository.findOne({
      where: {
        id: createdById,
      },
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
      JoinAs.OBSERVER,
    )
    const voteOptions = await this.voteOptionService.createDefaults(
      savedNewRoom.id,
    )

    savedNewRoom.participants = [participant]
    savedNewRoom.voteOptions = voteOptions

    return savedNewRoom
  }

  @Transactional()
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
      relations: {
        participants: true,
      },
    })

    if (!room) throw new NotFoundException(`Room with id ${roomId} not found`)

    const existingParticipant = room.participants.find(
      (participant) => participant.userId === userId,
    )

    if (existingParticipant) return existingParticipant

    const participant: Participant = await this.participantService.create(
      userId,
      roomId,
      joinAs,
    )
    await participant.save()

    return participant
  }

  async leave(roomId: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) throw new NotFoundException(`User with id ${userId} not found`)

    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: { createdBy: true },
    })

    if (!room) throw new NotFoundException(`Room with id ${roomId} not found`)

    if (room.createdBy.id === userId) {
      throw new BadRequestException('The room creator cannot leave the room')
    }

    const participant = await this.participantService.findById(userId, roomId)

    if (!participant)
      throw new NotFoundException(
        `Participant with userId ${userId} and roomId ${roomId} not found`,
      )

    await this.participantService.remove(participant)
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
