import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@app/services/user.service'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { User } from '@app/entities/user.entity'
import { JwtPayload } from '@app/services/jwt.service'
import { Algorithm } from 'jsonwebtoken'

@Injectable()
export class AuthService {
  private _ALGORITHMS_: Algorithm = 'HS512'

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerGoogleUser(user: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(user.email)

    if (existingUser) return existingUser

    user.isVerified = true
    return this.userService.createUser(user)
  }

  async signIn(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = AuthService.createPayload(user)
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 3600,
      algorithm: this._ALGORITHMS_,
    })
    const { refreshToken } = await this.createRefreshToken()

    return { accessToken, refreshToken }
  }

  async createRefreshToken(): Promise<{ refreshToken: string }> {
    const refreshToken = await this.jwtService.sign(
      {},
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
        algorithm: this._ALGORITHMS_,
      },
    )

    return { refreshToken }
  }

  async signInWithRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
        algorithms: [this._ALGORITHMS_]
      })
      const user = await this.userService.getByUserId(payload.sub)

      if (!user) {
        throw new UnauthorizedException()
      }

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      })
      return { accessToken }
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  static createPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
    }
  }
}
