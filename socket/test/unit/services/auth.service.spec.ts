import { Test, TestingModule } from '@nestjs/testing'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from '@app/services/auth.service'
import { UserService } from '@app/services/user.service'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { User } from '@app/entities/user.entity'

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '1h' },
        }),
        ConfigModule.forRoot(),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
            validateUserPassword: jest.fn(),
          },
        }
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('registerGoogleUser', () => {
    it('should register a new Google user or return an existing one', async () => {
      const googleUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      } as CreateUserDto

      const existingUser = new User()
      existingUser.email = googleUser.email
      existingUser.firstName = googleUser.firstName
      existingUser.lastName = googleUser.lastName
      existingUser.avatarUrl = googleUser.avatarUrl

      userService.findByEmail = jest.fn().mockResolvedValueOnce(null)
      userService.createUser = jest.fn().mockResolvedValueOnce(existingUser)
      userService.findByEmail = jest.fn().mockResolvedValueOnce(existingUser)

      const newUser = await authService.registerGoogleUser(googleUser)
      expect(newUser).toEqual(existingUser)

      const existingRegisteredUser = await authService.registerGoogleUser(
        googleUser,
      )
      expect(existingRegisteredUser).toEqual(existingUser)
    })
  })

  describe('signIn', () => {
    it('should be generated JWT token for the user', async () => {
      const user = {
        id: 1,
        email: 'john.doe@gmail.com',
      } as User

      const jwtPayload = {
        sub: user.id,
        email: user.email,
      }

      const accessToken = 'jwtAccessToken'

      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken)

      const result = await authService.signIn(user)

      expect(jwtService.sign).toHaveBeenCalledWith(jwtPayload)
      expect(result).toEqual({ accessToken })
    })
  })
})
