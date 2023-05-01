import { Test, TestingModule } from '@nestjs/testing'
import { VoteService } from '@app/services/vote.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Vote } from '@app/entities/vote.entity'
import { User } from '@app/entities/user.entity'
import { Story } from '@app/entities/story.entity'

const mockVoteRepository = () => ({
  save: jest.fn(),
})

const mockUserRepository = () => ({
  findOne: jest.fn(),
})

const mockStoryRepository = () => ({
  findOne: jest.fn(),
})

describe('VoteService', () => {
  let service: VoteService
  let voteRepository: Repository<Vote>
  let userRepository: Repository<User>
  let storyRepository: Repository<Story>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        { provide: getRepositoryToken(Vote), useFactory: mockVoteRepository },
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: getRepositoryToken(Story), useFactory: mockStoryRepository },
      ],
    }).compile()

    service = module.get<VoteService>(VoteService)
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote))
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    storyRepository = module.get<Repository<Story>>(getRepositoryToken(Story))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a vote', async () => {
      const votedById = 1
      const storyId = 2

      userRepository.findOne = jest.fn().mockResolvedValue(new User())
      storyRepository.findOne = jest.fn().mockResolvedValue(new Story())
      voteRepository.save = jest.fn().mockResolvedValue(new Vote())

      const result = await service.create(votedById, storyId)

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: votedById },
      })
      expect(storyRepository.findOne).toHaveBeenCalledWith({
        where: { id: storyId },
      })
      expect(voteRepository.save).toHaveBeenCalled()
      expect(result).toBeInstanceOf(Vote)
    })

    it('should throw an error if the user is not found', async () => {
      const votedById = 1
      const storyId = 2

      userRepository.findOne = jest.fn().mockResolvedValue(undefined)
      storyRepository.findOne = jest.fn().mockResolvedValue(new Story())

      await expect(service.create(votedById, storyId)).rejects.toThrow(
        'User not found',
      )
    })

    it('should throw an error if the story is not found', async () => {
      const votedById = 1
      const storyId = 2

      userRepository.findOne = jest.fn().mockResolvedValue(new User())
      storyRepository.findOne = jest.fn().mockResolvedValue(undefined)

      await expect(service.create(votedById, storyId)).rejects.toThrow(
        'Story not found',
      )
    })
  })
})
