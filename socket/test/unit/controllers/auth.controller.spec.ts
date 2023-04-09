import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@app/controllers/auth.controller';
import { AuthService } from '@app/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@app/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('googleLoginCallback', () => {
    it('should generate access token and redirect', async () => {
      const req = {
        user: new User(),
      };

      const res = {
        redirect: jest.fn(),
      };

      const accessToken = {
        accessToken: 'accessToken123',
      };

      authService.signIn = jest.fn().mockResolvedValue(accessToken);

      await authController.googleLoginCallback(req, res);

      expect(authService.signIn).toHaveBeenCalledWith(req.user);
      expect(res.redirect).toHaveBeenCalledWith(
        `${process.env.FRONTEND_URL}/login?access_token=${accessToken.accessToken}`,
      );
    });

    it('should generate access token and redirect for existing user', async () => {
      const existingUser = new User();
      existingUser.id = 1;
      existingUser.email = 'john.doe@gmail.com';
      existingUser.firstName = 'John';
      existingUser.lastName = 'Doe';

      const req = {
        user: existingUser,
      };

      const res = {
        redirect: jest.fn(),
      };

      const accessToken = {
        accessToken: 'accessTokenExistingUser',
      };

      authService.signIn = jest.fn().mockResolvedValue(accessToken);

      await authController.googleLoginCallback(req, res);

      expect(authService.signIn).toHaveBeenCalledWith(existingUser);
      expect(res.redirect).toHaveBeenCalledWith(
        `${process.env.FRONTEND_URL}/login?access_token=${accessToken.accessToken}`,
      );
    });
  });
});
