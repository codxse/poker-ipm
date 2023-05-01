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
  } as any
}

describe('RoomGateway', () => {
  let gateway: RoomGateway
  let jwtAuthService: JwtAuthService

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
          useValue: {},
        },
        {
          provide: StoryService,
          useValue: {},
        },
        {
          provide: VoteOptionService,
          useValue: {},
        },
        {
          provide: VoteService,
          useValue: {},
        },
        {
          provide: VotingService,
          useValue: {},
        },
        {
          provide: ParticipantService,
          useValue: {},
        },
      ],
    }).compile()

    gateway = module.get<RoomGateway>(RoomGateway)
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })

  describe('handleConnection', () => {
    it('should join room when roomId is provided', async () => {
      const client = createMockSocket()
      client.handshake.query.roomId = '1234'
      await gateway.handleConnection(client)

      expect(client.join).toHaveBeenCalledWith('1234')
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
})
