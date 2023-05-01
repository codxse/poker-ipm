import { Test, TestingModule } from '@nestjs/testing'
import { VotingService } from '@app/services/voting.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Voting } from '@app/entities/voting.entity'
import { Vote } from '@app/entities/vote.entity'
import { VoteOption } from '@app/entities/vote-option.entity'

const mockVotingRepository = () => ({
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
})

const mockVoteRepository = () => ({
  findOne: jest.fn(),
})

const mockVoteOptionRepository = () => ({
  findOne: jest.fn(),
})

describe('VotingService', () => {
  let service: VotingService
  let votingRepository: Repository<Voting>
  let voteRepository: Repository<Vote>
  let voteOptionRepository: Repository<VoteOption>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotingService,
        {
          provide: getRepositoryToken(Voting),
          useValue: mockVotingRepository(),
        },
        { provide: getRepositoryToken(Vote), useFactory: mockVoteRepository },
        {
          provide: getRepositoryToken(VoteOption),
          useFactory: mockVoteOptionRepository,
        },
      ],
    }).compile()

    service = module.get<VotingService>(VotingService)
    votingRepository = module.get<Repository<Voting>>(
      getRepositoryToken(Voting),
    )
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote))
    voteOptionRepository = module.get<Repository<VoteOption>>(
      getRepositoryToken(VoteOption),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('submitVoting', () => {
    it('should submit a voting', async () => {
      const votedById = 1
      const storyId = 2
      const voteOptionId = 3

      voteRepository.findOne = jest.fn().mockResolvedValue(new Vote())

      voteOptionRepository.findOne = jest
        .fn()
        .mockResolvedValue(new VoteOption())

      const newVoting = new Voting()
      ;(newVoting.id = 1), (newVoting.votedById = votedById)
      newVoting.storyId = storyId
      newVoting.voteOptionId = voteOptionId
      newVoting.createdAt = new Date()
      newVoting.updatedAt = new Date()

      votingRepository.save = jest.fn().mockResolvedValue(newVoting)
      votingRepository.create = jest.fn().mockReturnValue(newVoting)

      const result = await service.submitVoting(
        votedById,
        storyId,
        voteOptionId,
      )
      expect(voteRepository.findOne).toHaveBeenCalledWith({
        where: { votedById, storyId },
      })
      expect(voteOptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: voteOptionId },
      })
      expect(votingRepository.create).toHaveBeenCalledWith({
        votedById,
        storyId,
        voteOptionId,
      })
      expect(votingRepository.save).toHaveBeenCalledWith(newVoting)
      expect(result).toBeDefined()
      expect(result.id).toEqual(1)
      expect(result.votedById).toEqual(votedById)
      expect(result.storyId).toEqual(storyId)
      expect(result.voteOptionId).toEqual(voteOptionId)
    })

    it('should throw an error when vote is not found', async () => {
      voteRepository.findOne = jest.fn().mockResolvedValue(null)
      await expect(service.submitVoting(1, 2, 3)).rejects.toThrow(
        'Vote not found',
      )
    })

    it('should throw an error when vote option is not found', async () => {
      voteRepository.findOne = jest.fn().mockResolvedValue(new Vote())
      voteOptionRepository.findOne = jest.fn().mockResolvedValue(null)
      await expect(service.submitVoting(1, 2, 3)).rejects.toThrow(
        'Vote option not found',
      )
    })
  })

  describe('getUserVotingByStoryId', () => {
    it('should return votings by story and createdBy, ordered by createdAt', async () => {
      const storyId = 1
      const votedById = 2
      const votings = [
        {
          id: 1,
          votedById: votedById,
          storyId: storyId,
          voteOptionId: 1,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          votedById: votedById,
          storyId: storyId,
          voteOptionId: 2,
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ] as Voting[]

      votingRepository.find = jest.fn().mockResolvedValue(votings)
      const result = await service.getUserVotingByStoryId(storyId, votedById)

      expect(votingRepository.find).toHaveBeenCalledWith({
        where: { storyId, votedById },
        order: { createdAt: 'ASC' },
      })
      expect(result).toEqual(votings)
    })
  })
})
