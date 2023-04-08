import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '@app/services/user.service'
import { User } from '@app/entities/user.entity'

export interface JwtPayload {
  sub: number
  email: string
}

@Injectable()
export class JwtService extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
