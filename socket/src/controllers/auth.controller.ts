import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '@app/services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
    )
    res.redirect(
      `${process.env.FRONTEND_URL}/login?access_token=${accessToken}&refresh_token=${refreshToken}`,
    )
  }
}
