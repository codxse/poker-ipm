import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import {
  JwtService as JwtAuthService,
  JwtPayload,
} from '@app/services/jwt.service'
import { AbstractGateway } from '@app/gateways/abstract.gateway'
import { UserService } from '@app/services/user.service'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

@WebSocketGateway()
class MockGateway extends AbstractGateway {
  @WebSocketServer()
  server: Server

  constructor(jwtAuthService: JwtAuthService) {
    super(jwtAuthService)
  }
}

function createMockSocket(token?: string, roomId?: string): Socket {
  return {
    handshake: {
      query: {
        roomId,
      },
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    },
    disconnect: jest.fn(),
  } as any
}

const mockJwtAuthService = () => ({
  validateToken: jest.fn(),
  generateAccessToken: jest.fn(),
})

const mockUserService = () => ({
  // TODO
})

describe('AbstractGateway', () => {
  let app: INestApplication
  let jwtAuthService: JwtAuthService
  let gateway: AbstractGateway

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        {
          provide: AbstractGateway,
          useClass: MockGateway,
        },
        {
          provide: JwtAuthService,
          useFactory: mockJwtAuthService,
        },
        {
          provide: UserService,
          useFactory: mockUserService,
        },
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtAuthService = moduleRef.get<JwtAuthService>(JwtAuthService)
    gateway = moduleRef.get<AbstractGateway>(AbstractGateway)
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })

  it('should throw an exception when no token is provided', async () => {
    const client = createMockSocket()
    try {
      await gateway.handleConnection(client)
    } catch (error) {
      expect(error).toBeDefined()
    }
    expect(client.disconnect).toHaveBeenCalled()
  })

  it('should throw an exception when an invalid token is provided', async () => {
    jest.spyOn(jwtAuthService, 'validateToken').mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const client = createMockSocket('invalid_token')
    try {
      await gateway.handleConnection(client)
    } catch (error) {
      expect(error).toBeDefined()
    }
    expect(client.disconnect).toHaveBeenCalled()
  })

  it('should add user data to the client when a valid token is provided', async () => {
    const payload = { sub: 1, firstName: 'testuser' } as JwtPayload

    jwtAuthService.generateAccessToken = jest
      .fn()
      .mockResolvedValue('stub-token')
    jwtAuthService.validateToken = jest.fn().mockResolvedValue(payload)

    const token = await jwtAuthService.generateAccessToken(payload)

    const client = createMockSocket(token)

    await gateway.handleConnection(client)

    expect(client.data).toBeDefined()
    expect(client.data.user).toEqual(expect.objectContaining(payload))
  })
})
