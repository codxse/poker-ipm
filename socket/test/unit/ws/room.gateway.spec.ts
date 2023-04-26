import { Test, TestingModule } from '@nestjs/testing'
import { RoomGateway } from '@app/ws/room.gateway'
import { Socket } from 'socket.io'
import { createMock } from '@golevelup/ts-jest'
import { JwtService as JwtStrategy } from '@app/services/jwt.service'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { UserService } from '@app/services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@app/entities/user.entity'
import { UserModule } from '@app/modules/user.module'

describe('RoomGateway', () => {
  let roomGateway: RoomGateway
  let jwtStrategy: JwtStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      providers: [UserService, JwtStrategy, RoomGateway],
    }).compile()

    roomGateway = module.get<RoomGateway>(RoomGateway)
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
  })

  fit('should be defined', () => {
    expect(roomGateway).toBeDefined()
  })

  describe('handleConnection', () => {
    let client: Socket

    beforeEach(() => {
      client = createMock<Socket>({
        handshake: {
          query: {},
        },
      })
    })

    it('should disconnect client if no token provided', () => {
      client.handshake.query.token = undefined
      const disconnectSpy = jest.spyOn(client, 'disconnect')

      roomGateway.handleConnection(client)

      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should disconnect client if token is invalid', () => {
      client.handshake.query.token = 'invalid_token'
      const disconnectSpy = jest.spyOn(client, 'disconnect')

      roomGateway.handleConnection(client)

      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should store user data in the client if token is valid', () => {
      const payload = { sub: 1, username: 'testuser' }
      const token = jwtStrategy.sign(payload, process.env.JWT_SECRET)
      client.handshake.query.token = token

      roomGateway.handleConnection(client)

      expect(client.data).toBeDefined()
      expect(client.data.user).toEqual(expect.objectContaining(payload))
    })
  })
})
