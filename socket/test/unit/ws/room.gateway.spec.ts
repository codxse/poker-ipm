import { Test, TestingModule } from '@nestjs/testing'
import { RoomGateway } from '@app/ws/room.gateway'
import { Socket } from 'socket.io'
import { createMock } from '@golevelup/ts-jest'
import {
  JwtPayload,
  JwtService as JwtStrategy,
} from '@app/services/jwt.service'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { UserService } from '@app/services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@app/entities/user.entity'
import { UserModule } from '@app/modules/user.module'

const mockJwtAuthService = () => ({
  validateToken: jest.fn(),
  generateAccessToken: jest.fn(),
})

const mockUserService = () => ({
  // TODO
})

describe('RoomGateway', () => {
  let websocket: RoomGateway
  let jwtStrategy: JwtStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomGateway,
        {
          provide: JwtStrategy,
          useFactory: mockJwtAuthService,
        },
        {
          provide: UserService,
          useFactory: mockUserService,
        },
      ],
    }).compile()

    websocket = module.get<RoomGateway>(RoomGateway)
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
  })

  it('should be defined', () => {
    expect(websocket).toBeDefined()
  })

  describe('handleConnection', () => {
    let client: Socket

    beforeEach(() => {
      client = createMock<Socket>({
        handshake: {
          query: {},
          headers: {
            authorization: '',
          },
        },
      })
    })

    it('should disconnect client if no token provided', () => {
      client.handshake.headers.authorization = ''
      const disconnectSpy = jest.spyOn(client, 'disconnect')

      websocket.handleConnection(client)

      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should disconnect client if token is invalid', async () => {
      jwtStrategy.validateToken = jest.fn().mockRejectedValue('error')

      client.handshake.headers.authorization = 'Bearer invalid'
      const disconnectSpy = jest.spyOn(client, 'disconnect')

      await websocket.handleConnection(client)

      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should store user data in the client if token is valid', async () => {
      const payload = { sub: 1, firstName: 'testuser' } as JwtPayload

      jwtStrategy.generateAccessToken = jest
        .fn()
        .mockResolvedValue('stub-token')
      jwtStrategy.validateToken = jest.fn().mockResolvedValue(payload)

      const token = await jwtStrategy.generateAccessToken(payload)
      client.handshake.headers.authorization = `Bearer ${token}`

      await websocket.handleConnection(client)

      expect(client.data).toBeDefined()
      expect(client.data.user).toEqual(expect.objectContaining(payload))
    })
  })
})
