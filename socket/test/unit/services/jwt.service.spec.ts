import { Test, TestingModule } from '@nestjs/testing'
import { JwtService, JwtPayload } from '@app/services/jwt.service'
import { UserService } from '@app/services/user.service'
import { User } from '@app/entities/user.entity'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService as NestJwtService } from '@nestjs/jwt'

beforeAll(() => {
  process.env.JWT_SECRET = 'mock-jwt-secret'
})

describe('JwtService', () => {
  let jwtService: JwtService
  let userService: UserService
  let nestJwtService: NestJwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: NestJwtService,
          useValue: {
            verifyAsync: jest.fn(),
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile()

    jwtService = module.get<JwtService>(JwtService)
    userService = module.get<UserService>(UserService)
    nestJwtService = module.get<NestJwtService>(NestJwtService)
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

  describe('validateToken', () => {
    it('should throw UnauthorizedException if token is not valid', async () => {
      nestJwtService.verifyAsync = jest.fn().mockRejectedValueOnce(new Error())

      await expect(jwtService.validateToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should return a User object if token is valid', async () => {
      const validPayload: JwtPayload = {
        sub: 1,
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: '',
        isVerified: true,
      }

      nestJwtService.verifyAsync = jest.fn().mockResolvedValueOnce(validPayload)

      const result = await jwtService.validateToken('valid-token')

      expect(result).toBeInstanceOf(User)
      expect(result.id).toEqual(validPayload.sub)
      expect(result.firstName).toEqual(validPayload.firstName)
    })
  })

  describe('generateAccessToken', () => {
    it('should call jwtService.signAsync with the payload and secret', async () => {
      const payload: JwtPayload = {
        sub: 1,
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: '',
        isVerified: true,
      }

      jwtService.signAsync = jest.fn().mockResolvedValueOnce('generated-token')

      await jwtService.generateAccessToken(payload)

      expect(nestJwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: process.env.JWT_SECRET,
      })
    })
  })
})
