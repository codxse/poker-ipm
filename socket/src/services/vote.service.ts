import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Vote } from '@app/entities/vote.entity'
import { User } from '@app/entities/user.entity'
import { Story } from '@app/entities/story.entity'

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  async create(votedById: number, storyId: number): Promise<Vote> {
    const votedBy = await this.userRepository.findOne({
      where: { id: votedById },
    })
    if (!votedBy) {
      throw new Error('User not found')
    }

    const story = await this.storyRepository.findOne({ where: { id: storyId } })
    if (!story) {
      throw new Error('Story not found')
    }

    const vote = new Vote()
    vote.votedBy = votedBy
    vote.story = story
    vote.votedById = votedById
    vote.storyId = storyId

    return this.voteRepository.save(vote)
  }

  async upsert(votedById: number, storyId: number): Promise<Vote> {
    const votedBy = await this.userRepository.findOne({
      where: { id: votedById },
    })
    if (!votedBy) {
      throw new Error('User not found')
    }

    const story = await this.storyRepository.findOne({ where: { id: storyId } })
    if (!story) {
      throw new Error('Story not found')
    }

    let vote = await this.voteRepository.findOne({
      where: { votedById, storyId },
    })
    if (!vote) {
      vote = this.voteRepository.create({ votedById, storyId })
      return this.voteRepository.save(vote)
    }

    return vote
  }
}
