import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VoteOption } from '@app/entities/vote-option.entity'
import { CreateVoteOptionDto } from '@app/dto/create-vote-option.dto'

@Injectable()
export class VoteOptionService {
  constructor(
    @InjectRepository(VoteOption)
    private voteOptionRepository: Repository<VoteOption>,
  ) {}

  async create(voteOption: CreateVoteOptionDto) {
    const newVoteOption = this.voteOptionRepository.create(voteOption)
    return this.voteOptionRepository.save(newVoteOption)
  }

  async createDefaults(roomId: number) {
    const defaultValues = [
      { value: 0, label: 'Usually typo' },
      { value: 1, label: 'Easy changes' },
      { value: 2, label: "Not sure, but it's not hard" },
      { value: 3, label: "Not sure, but it's not easy" },
      { value: 5, label: 'Complex' },
    ]
    const voteOptions: VoteOption[] = defaultValues.map(({ value, label }) =>
      this.voteOptionRepository.create({ roomId, label, value }),
    )
    return this.voteOptionRepository.save(voteOptions)
  }

  async findByRoomId(roomId: number) {
    return this.voteOptionRepository.find({ where: { roomId } })
  }

  async update(id: number, updateVoteOptionDto: Partial<CreateVoteOptionDto>) {
    await this.voteOptionRepository.update(id, updateVoteOptionDto)
    return this.voteOptionRepository.findOne({ where: { id } })
  }

  async remove(id: number) {
    return this.voteOptionRepository.delete(id)
  }
}
