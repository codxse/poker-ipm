import { Test, TestingModule } from '@nestjs/testing'
import { JwtService, JwtPayload } from '@app/services/jwt.service'
import { UserService } from '@app/services/user.service'
import { User } from '@app/entities/user.entity'
import { UnauthorizedException } from '@nestjs/common'

beforeAll(() => {
  process.env.JWT_SECRET = 'mock-jwt-secret'
})

describe('JwtService', () => {
  let jwtService: JwtService
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile()

    jwtService = module.get<JwtService>(JwtService)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(jwtService).toBeDefined()
    expect(userService).toBeDefined()
  })

  describe('validate', () => {
    it('should return a user object from a valid payload', async () => {
      const payload: JwtPayload = {
        sub: 1,
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        isVerified: true,
      }

      const user = await jwtService.validate(payload)

      expect(user).toBeInstanceOf(User)
      expect(user.id).toEqual(payload.sub)
      expect(user.firstName).toEqual(payload.firstName)
      expect(user.lastName).toEqual(payload.lastName)
      expect(user.avatarUrl).toEqual(payload.avatarUrl)
      expect(user.isVerified).toEqual(payload.isVerified)
    })

    it('should throw UnauthorizedException when the payload is missing required fields', async () => {
      const payloadWithoutIsVerified = {
        sub: 1,
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
      } as JwtPayload

      const payloadWIithoudId = {
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        isVerified: true,
      } as JwtPayload

      await expect(
        jwtService.validate(payloadWithoutIsVerified),
      ).rejects.toThrow(UnauthorizedException)
      await expect(jwtService.validate(payloadWIithoudId)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
