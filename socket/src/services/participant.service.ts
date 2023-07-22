import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JoinAs, Participant } from '@app/entities/participant.entity'

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async create(
    userId: number,
    roomId: number,
    joinAs: JoinAs,
  ): Promise<Participant> {
    const participant = new Participant()
    participant.userId = userId
    participant.roomId = roomId
    participant.joinAs = joinAs

    const newParticipant = this.participantRepository.create(participant)
    return this.participantRepository.save(newParticipant)
  }

  async findById(userId: number, roomId: number) {
    return this.participantRepository.findOneBy({ userId, roomId })
  }

  async remove(participant: Participant) {
    await this.participantRepository.remove(participant)
  }

  async getByRoomId(roomId: number) {
    return this.participantRepository.find({ 
      where: { roomId },
      relations: { user: true }
    })
  }
}
