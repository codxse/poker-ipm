import { Test, TestingModule } from '@nestjs/testing'
import { JwtService, JwtPayload } from '@app/services/jwt.service'
import { UserService } from '@app/services/user.service'
import { User } from '@app/entities/user.entity'

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
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile()

    jwtService = module.get<JwtService>(JwtService)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(jwtService).toBeDefined()
  })

  describe('validate', () => {
    it('should return the user if JWT payload is valid', async () => {
      const jwtPayload = {
        sub: 1,
        email: 'test@example.com',
      } as JwtPayload

      const user = {
        id: 1,
        email: 'test@example.com',
      } as User

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user)

      const validatedUser = await jwtService.validate(jwtPayload)
      expect(validatedUser).toEqual(user)
    })

    it('should throw an error if JWT payload is invalid', async () => {
      const jwtPayload: JwtPayload = {
        sub: 1,
        email: 'invalid@example.com',
      }

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)

      await expect(jwtService.validate(jwtPayload)).rejects.toThrowError()
    })
  })
})
