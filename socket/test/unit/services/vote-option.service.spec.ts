import { Test, TestingModule } from '@nestjs/testing'
import { VoteOptionService } from '@app/services/vote-option.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { VoteOption } from '@app/entities/vote-option.entity'
import { Repository } from 'typeorm'
import { CreateVoteOptionDto } from '@app/dto/create-vote-option.dto'
import { DeleteResult } from 'typeorm'

describe('VoteOptionService', () => {
  let service: VoteOptionService
  let repository: Repository<VoteOption>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteOptionService,
        {
          provide: getRepositoryToken(VoteOption),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<VoteOptionService>(VoteOptionService)
    repository = module.get<Repository<VoteOption>>(
      getRepositoryToken(VoteOption),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new vote option', async () => {
      const createVoteOptionDto: CreateVoteOptionDto = {
        roomId: 1,
        label: 'Test option',
        value: 1,
      }

      const createdVoteOption = new VoteOption()
      Object.assign(createdVoteOption, createVoteOptionDto)

      jest.spyOn(repository, 'create').mockReturnValue(createdVoteOption)
      jest.spyOn(repository, 'save').mockResolvedValue(createdVoteOption)

      const result = await service.create(createVoteOptionDto)
      expect(result).toEqual(createdVoteOption)
    })
  })

  describe('findByRoomId', () => {
    it('should find vote options by room ID', async () => {
      const roomId = 1
      const voteOptions = [new VoteOption(), new VoteOption()]

      jest.spyOn(repository, 'find').mockResolvedValue(voteOptions)

      const result = await service.findByRoomId(roomId)
      expect(result).toEqual(voteOptions)
    })
  })

  describe('update', () => {
    it('should update a vote option', async () => {
      const id = 1
      const updateVoteOptionDto: Partial<CreateVoteOptionDto> = {
        label: 'Updated option',
      }

      const updatedVoteOption = new VoteOption()
      Object.assign(updatedVoteOption, updateVoteOptionDto, { id })

      jest.spyOn(repository, 'update').mockResolvedValue(undefined)
      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedVoteOption)

      const result = await service.update(id, updateVoteOptionDto)
      expect(result).toEqual(updatedVoteOption)
    })
  })

  describe('remove', () => {
    it('should remove a vote option', async () => {
      const id = 1

      const deleteResult = new DeleteResult()
      deleteResult.affected = 1

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult)

      const result = await service.remove(id)
      expect(result).toEqual(deleteResult)
    })
  })
})
