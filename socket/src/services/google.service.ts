import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { AuthService } from '@app/services/auth.service'
import { CreateUserDto } from '@app/dto/create-user.dto'

@Injectable()
export class GoogleService extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, emails, photos } = profile
    const userEmail = emails[0].value
    const userAvatarUrl = photos[0].value

    const user: CreateUserDto = {
      email: userEmail,
      firstName: name.givenName,
      lastName: name.familyName,
      avatarUrl: userAvatarUrl,
      password: 'password',
    }

    try {
      const registeredUser = await this.authService.registerGoogleUser(user)
      return registeredUser
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
