import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Story } from '@app/entities/story.entity'
import { CreateStoryDto } from '@app/dto/create-story.dto'

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
  ) {}

  async create(story: CreateStoryDto) {
    const newStory = this.storyRepository.create(story)
    return this.storyRepository.save(newStory)
  }

  async findOne(id: number) {
    return this.storyRepository.findOne({ where: { id }, relations: { votes: { votedBy: true, votings: true } } })
  }

  async findByRoomId(roomId: number) {
    return this.storyRepository.find({ where: { roomId } })
  }

  async findByCreatorId(createdById: number) {
    return this.storyRepository.find({ where: { createdById } })
  }

  async update(id: number, updateStoryDto: Partial<CreateStoryDto>) {
    await this.storyRepository.update(id, updateStoryDto)
    return this.storyRepository.findOne({ where: { id } })
  }

  async remove(id: number) {
    return this.storyRepository.delete(id)
  }
}
