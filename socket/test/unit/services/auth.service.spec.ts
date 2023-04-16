import { Test, TestingModule } from '@nestjs/testing'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from '@app/services/auth.service'
import { UserService } from '@app/services/user.service'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { User } from '@app/entities/user.entity'
import { JwtPayload } from '@app/services/jwt.service'

beforeAll(() => {
  process.env.JWT_REFRESH_SECRET = 'mock-jwt-refresh-secret'
  process.env.JTW_SECRET = 'mock-jwt-secret'
})

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule.forRoot()],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
            validateUserPassword: jest.fn(),
            getByUserId: jest.fn(),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('registerGoogleUser', () => {
    it('should set isVerified to true when registering a Google user', async () => {
      const googleUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      } as CreateUserDto

      const createdUser = {
        ...googleUser,
        isVerified: false,
      } as User

      userService.findByEmail = jest.fn().mockResolvedValueOnce(null)
      userService.createUser = jest.fn().mockResolvedValueOnce({
        ...createdUser,
        isVerified: true,
      })

      const newUser = await authService.registerGoogleUser(googleUser)

      expect(newUser.isVerified).toBe(true)
      expect(userService.createUser).toHaveBeenCalledWith({
        ...googleUser,
        isVerified: true,
      })
    })

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
        firstName: 'Jhon',
        lastName: 'Doe',
        avatarUrl: 'http://pic',
        isVerified: true,
      } as User

      const jwtPayload: JwtPayload = {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
      }

      const accessToken = 'jwtAccessToken'
      const accessTokenOptions = {
        secret: process.env.JWT_SECRET,
        expiresIn: 3600,
      }
      const refreshToken = 'refreshToken'

      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken)
      jest
        .spyOn(authService, 'createRefreshToken')
        .mockResolvedValue({ refreshToken })

      const result = await authService.signIn(user)

      expect(jwtService.sign).toHaveBeenCalledWith(
        jwtPayload,
        accessTokenOptions,
      )
      expect(result).toEqual({ accessToken, refreshToken })
    })
  })

  describe('createRefreshToken', () => {
    it('should create a JWT refresh token for the user', async () => {
      const user = {
        id: 1,
        firstName: 'Jhon',
        lastName: 'Doe',
        avatarUrl: 'http://pic',
        isVerified: true,
      } as User

      const jwtPayload: JwtPayload = {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
      }

      const refreshToken = 'jwtRefreshToken'
      const refreshTokenOptions = {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }

      jest.spyOn(jwtService, 'sign').mockReturnValue(refreshToken)

      const result = await authService.createRefreshToken(user)

      expect(jwtService.sign).toHaveBeenCalledWith(
        jwtPayload,
        refreshTokenOptions,
      )
      expect(result).toEqual({ refreshToken })
    })
  })

  describe('signInWithRefreshToken', () => {
    it('should sign in the user with a refresh token', async () => {
      const refreshToken = 'jwtRefreshToken'
      const accessToken = 'jwtAccessToken'
      const user = {
        id: 1,
        firstName: 'Doe',
        lastName: 'Email',
        avatarUrl: 'http://pic',
        isVerified: true,
      } as User

      const jwtPayload = AuthService.createPayload(user)

      jest.spyOn(jwtService, 'verify').mockReturnValue(jwtPayload)
      jest.spyOn(userService, 'getByUserId').mockResolvedValue(user)
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken)

      const result = await authService.signInWithRefreshToken(refreshToken)

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
      expect(userService.getByUserId).toHaveBeenCalledWith(user.id)
      expect(jwtService.sign).toHaveBeenCalledWith(jwtPayload, {
        secret: process.env.JWT_SECRET,
      })
      expect(result).toEqual({ accessToken })
    })
  })
})
