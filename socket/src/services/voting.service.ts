import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Voting } from '@app/entities/voting.entity'
import { Vote } from '@app/entities/vote.entity'
import { VoteOption } from '@app/entities/vote-option.entity'

@Injectable()
export class VotingService {
  constructor(
    @InjectRepository(Voting)
    private votingRepository: Repository<Voting>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(VoteOption)
    private voteOptionRepository: Repository<VoteOption>,
  ) {}

  async submitVoting(
    votedById: number,
    storyId: number,
    voteOptionId: number,
  ): Promise<Voting> {
    const vote = await this.voteRepository.findOne({
      where: { votedById, storyId },
    })
    if (!vote) {
      throw new Error('Vote not found')
    }

    const voteOption = await this.voteOptionRepository.findOne({
      where: { id: voteOptionId },
    })
    if (!voteOption) {
      throw new Error('Vote option not found')
    }

    const newVoting = this.votingRepository.create({
      votedById,
      storyId,
      voteOptionId,
    })
    return this.votingRepository.save(newVoting)
  }

  async getUserVotingByStoryId(storyId: number, votedById: number) {
    return this.votingRepository.find({
      where: { storyId, votedById },
      order: { createdAt: 'ASC' },
    })
  }
}
