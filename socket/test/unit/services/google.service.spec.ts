import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { GoogleService } from '@app/services/google.service'
import { AuthService } from '@app/services/auth.service'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { User } from '@app/entities/user.entity'

beforeAll(() => {
  process.env.GOOGLE_CLIENT_ID = 'mock-client-id'
  process.env.GOOGLE_CLIENT_SECRET = 'mock-client-secret'
  process.env.GOOGLE_CALLBACK_URL = 'mock-callback-url'
})

describe('GoogleService', () => {
  let googleService: GoogleService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleService,
        {
          provide: AuthService,
          useValue: {
            registerGoogleUser: jest.fn(),
          },
        },
      ],
    }).compile()

    googleService = module.get<GoogleService>(GoogleService)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(googleService).toBeDefined()
  })

  describe('validate', () => {
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

      jest
        .spyOn(authService, 'registerGoogleUser')
        .mockResolvedValue(existingUser)

      const validatedUser = await googleService.validate(
        'moack-access-token',
        'mock-refresh-token',
        {
          id: 'google-id',
          name: {
            givenName: googleUser.firstName,
            familyName: googleUser.lastName,
          },
          emails: [{ value: googleUser.email }],
          photos: [{ value: googleUser.avatarUrl }],
        },
      )

      expect(validatedUser).toEqual(existingUser)
    })

    it('should throw UnauthorizedException if registering a Google user fails', async () => {
      const googleUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      } as CreateUserDto

      jest
        .spyOn(authService, 'registerGoogleUser')
        .mockRejectedValue(new Error('User registration failed'))

      await expect(
        googleService.validate('mock-access-token', 'mock-refresh-token', {
          id: 'google-id',
          name: {
            givenName: googleUser.firstName,
            familyName: googleUser.lastName,
          },
          emails: [{ value: googleUser.email }],
          photos: [{ value: googleUser.avatarUrl }],
        }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
