import {
  Body,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '@app/services/auth.service'
import { RequestWithUser } from '@app/interfaces/request-with-user.interface'

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
  async googleLoginCallback(
    @Req() req: RequestWithUser,
    @Res() res: Partial<Response>,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
    )
    res.redirect(
      `${process.env.FRONTEND_URL}/login?access_token=${accessToken}&refresh_token=${refreshToken}`,
    )
  }

  @Post('refresh')
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.signInWithRefreshToken(refreshToken)
  }
}
