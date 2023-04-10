import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '@app/services/user.service'
import { User } from '@app/entities/user.entity'

export interface JwtPayload {
  sub: number
  firstName: string
  lastName: string
  avatarUrl: string
  isVerified: boolean
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
    if (!payload.isVerified || !payload.sub) {
      throw new UnauthorizedException()
    }

    const user = new User()
    user.id = payload.sub
    user.firstName = payload.firstName
    user.lastName = payload.lastName
    user.avatarUrl = payload.avatarUrl
    user.isVerified = payload.isVerified

    return user
  }
}
