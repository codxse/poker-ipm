import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '@app/controllers/auth.controller'
import { AuthService } from '@app/services/auth.service'
import { User } from '@app/entities/user.entity'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signInWithRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  describe('googleLoginCallback', () => {
    it('should generate access token and redirect', async () => {
      const req = {
        user: new User(),
      }

      const res = {
        redirect: jest.fn(),
      }

      const tokens = {
        accessToken: 'accessToken123',
        refreshToken: 'refreshToken123',
      }

      authService.signIn = jest.fn().mockResolvedValue(tokens)

      await authController.googleLoginCallback(req, res)

      expect(authService.signIn).toHaveBeenCalledWith(req.user)
      expect(res.redirect).toHaveBeenCalledWith(
        `${process.env.FRONTEND_URL}/login?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`,
      )
    })

    it('should generate access token and redirect for existing user', async () => {
      const existingUser = new User()
      existingUser.id = 1
      existingUser.email = 'john.doe@gmail.com'
      existingUser.firstName = 'John'
      existingUser.lastName = 'Doe'

      const req = {
        user: existingUser,
      }

      const res = {
        redirect: jest.fn(),
      }

      const tokens = {
        accessToken: 'accessTokenExistingUser',
        refreshToken: 'refreshToken',
      }

      authService.signIn = jest.fn().mockResolvedValue(tokens)

      await authController.googleLoginCallback(req, res)

      expect(authService.signIn).toHaveBeenCalledWith(existingUser)
      expect(res.redirect).toHaveBeenCalledWith(
        `${process.env.FRONTEND_URL}/login?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`,
      )
    })
  })

  describe('refreshAccessToken', () => {
    it('should refresh the access token using a refresh token', async () => {
      const refreshToken = 'jwtRefreshToken'
      const accessToken = 'jwtAccessToken'

      authService.signInWithRefreshToken = jest
        .fn()
        .mockResolvedValue({ accessToken })

      const result = await authController.refreshAccessToken(refreshToken)

      expect(authService.signInWithRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      )
      expect(result).toEqual({ accessToken })
    })
  })
})
