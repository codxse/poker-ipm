import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '@app/services/user.service'
import { User } from '@app/entities/user.entity'
import { JwtService as NestJwtService } from '@nestjs/jwt'
import { Algorithm } from 'jsonwebtoken'

export interface JwtPayload {
  sub: number
  firstName: string
  lastName: string
  avatarUrl: string
  isVerified: boolean
}

@Injectable()
export class JwtService extends PassportStrategy(Strategy) {
  private _ALGORITHMS_: Algorithm = 'HS512'

  constructor(
    private userService: UserService,
    private readonly jwtService: NestJwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
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

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
        algorithms: [this._ALGORITHMS_],
      })
      return this.validate(payload)
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      algorithm: this._ALGORITHMS_,
    })
  }
}
