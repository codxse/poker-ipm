import { Test, TestingModule } from '@nestjs/testing'
import { ParticipantService } from '@app/services/participant.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JoinAs, Participant } from '@app/entities/participant.entity'

describe('ParticipantService', () => {
  let participantService: ParticipantService
  const mockParticipantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantService,
        {
          provide: getRepositoryToken(Participant),
          useValue: mockParticipantRepository,
        },
      ],
    }).compile()

    participantService = module.get<ParticipantService>(ParticipantService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(participantService).toBeDefined()
  })

  describe('create', () => {
    it('should create a participant', async () => {
      const userId = 1
      const roomId = 1
      const joinAs = JoinAs.OBSERVER

      const newParticipant = new Participant()
      newParticipant.userId = userId
      newParticipant.roomId = roomId
      newParticipant.joinAs = joinAs

      mockParticipantRepository.create.mockReturnValue(newParticipant)
      mockParticipantRepository.save.mockResolvedValue(newParticipant)

      const result = await participantService.create(userId, roomId, joinAs)

      expect(result).toEqual(newParticipant)
      expect(mockParticipantRepository.create).toHaveBeenCalledWith({
        userId,
        roomId,
        joinAs,
      })
      expect(mockParticipantRepository.save).toHaveBeenCalledWith(
        newParticipant,
      )
    })
  })

  describe('findById', () => {
    it('should find a participant by userId and roomId', async () => {
      const userId = 1
      const roomId = 2

      const expectedParticipant = new Participant()
      expectedParticipant.userId = userId
      expectedParticipant.roomId = roomId

      mockParticipantRepository.findOneBy.mockResolvedValue(expectedParticipant)

      const result = await participantService.findById(userId, roomId)

      expect(result).toEqual(expectedParticipant)
      expect(mockParticipantRepository.findOneBy).toHaveBeenCalledWith({
        userId,
        roomId,
      })
    })

    it('should return null if the participant is not found', async () => {
      const userId = 1
      const roomId = 2

      mockParticipantRepository.findOneBy.mockResolvedValue(null)

      const result = await participantService.findById(userId, roomId)

      expect(result).toBeNull()
      expect(mockParticipantRepository.findOneBy).toHaveBeenCalledWith({
        userId,
        roomId,
      })
    })
  })

  describe('remove', () => {
    it('should remove the participant', async () => {
      const userId = 1
      const roomId = 2

      const participant = new Participant()
      participant.userId = userId
      participant.roomId = roomId

      mockParticipantRepository.remove.mockResolvedValue(null)

      await participantService.remove(participant)

      expect(mockParticipantRepository.remove).toHaveBeenCalledWith(participant)
    })
  })
})
