import { Test, TestingModule } from '@nestjs/testing'
import { RoomGateway } from '@app/gateways/impl/room.gateway.impl'
import { JwtService as JwtAuthService } from '@app/services/jwt.service'
import { Socket } from 'socket.io'
import { RoomService } from '@app/services/room.service'
import { StoryService } from '@app/services/story.service'
import { VoteOptionService } from '@app/services/vote-option.service'
import { VoteService } from '@app/services/vote.service'
import { VotingService } from '@app/services/voting.service'
import { ParticipantService } from '@app/services/participant.service'
import { CreateVoteOptionDto } from '@app/dto/create-vote-option.dto'
import { CreateStoryDto } from '@app/dto/create-story.dto'
import { SubmitVotingDto } from '@app/dto/submit-voting-dto'
function createMockSocket(token?: string, roomId?: string): Socket {
  return {
    handshake: {
      query: {
        roomId,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    join: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
  } as any
}

describe('RoomGateway', () => {
  let gateway: RoomGateway
  let roomService: RoomService
  let storyService: StoryService
  let voteOptionService: VoteOptionService
  let voteService: VoteService
  let votingService: VotingService
  let participantService: ParticipantService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomGateway,
        {
          provide: JwtAuthService,
          useValue: {
            validateToken: jest.fn(),
          },
        },
        {
          provide: RoomService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: StoryService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: VoteOptionService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: VoteService,
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: VotingService,
          useValue: {
            submitVoting: jest.fn(),
          },
        },
        {
          provide: ParticipantService,
          useValue: {},
        },
      ],
    }).compile()

    gateway = module.get<RoomGateway>(RoomGateway)
    roomService = module.get<RoomService>(RoomService)
    storyService = module.get<StoryService>(StoryService)
    voteOptionService = module.get<VoteOptionService>(VoteOptionService)
    voteService = module.get<VoteService>(VoteService)
    votingService = module.get<VotingService>(VotingService)
    participantService = module.get<ParticipantService>(ParticipantService)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })

  describe('handleConnection', () => {
    it('should join room when roomId is provided', async () => {
      const client = createMockSocket()
      client.handshake.query.roomId = '1234'
      await gateway.handleConnection(client)

      expect(client.join).toHaveBeenCalledWith('room:1234')
    })

    it('should disconnect and throw an exception when no roomId is provided', async () => {
      const client = createMockSocket()
      delete client.handshake.query.roomId

      await expect(gateway.handleConnection(client)).rejects.toThrow(
        'Room ID not found',
      )
      expect(client.disconnect).toHaveBeenCalledWith(true)
    })
  })

  describe('createVoteOption', () => {
    it('should create a vote option and return it', async () => {
      const dto = new CreateVoteOptionDto()
      const result = { id: 1, ...dto }
      ;(voteOptionService.create as jest.Mock).mockResolvedValue(result)

      const data = await gateway.createVoteOption(dto)

      expect(voteOptionService.create).toHaveBeenCalledWith(dto)
      expect(data).toEqual({ event: 'createVoteOption', data: result })
    })
  })

  describe('roomById', () => {
    it('should find a room and return it', async () => {
      const id = 1
      const result = { id }
      ;(roomService.findById as jest.Mock).mockResolvedValue(result)

      const data = await gateway.roomById(id)

      expect(roomService.findById).toHaveBeenCalledWith(id)
      expect(data).toEqual({ event: 'findRoom', data: result })
    })
  })

  describe('createStory', () => {
    it('should create a story and return it', async () => {
      const dto = new CreateStoryDto()
      const result = { id: 1, ...dto }
      ;(storyService.create as jest.Mock).mockResolvedValue(result)

      const data = await gateway.createStory(dto)

      expect(storyService.create).toHaveBeenCalledWith(dto)
      expect(data).toEqual({ event: 'createStory', data: result })
    })
  })

  describe('submitVoting', () => {
    it('should submit a vote and return it', async () => {
      const dto = new SubmitVotingDto()
      const result = { id: 1, ...dto }
      ;(voteService.upsert as jest.Mock).mockResolvedValue({})
      ;(votingService.submitVoting as jest.Mock).mockResolvedValue(result)

      const data = await gateway.submitVoting(dto)

      expect(voteService.upsert).toHaveBeenCalledWith(dto.userId, dto.storyId)
      expect(votingService.submitVoting).toHaveBeenCalledWith(
        dto.userId,
        dto.storyId,
        dto.voteOptionId,
      )
      expect(data).toEqual({ event: 'submitVoting', data: result })
    })
  })
})
