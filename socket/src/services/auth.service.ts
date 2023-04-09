import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@app/services/user.service'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { User } from '@app/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerGoogleUser(user: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(user.email)

    if (existingUser) return existingUser

    return this.userService.createUser(user)
  }

  async signIn(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    }

    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 3600,
    })

    const { refreshToken } = await this.createRefreshToken(user)

    return { accessToken, refreshToken }
  }

  async createRefreshToken(user: User): Promise<{ refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    }

    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    })
    return { refreshToken }
  }

  async signInWithRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
      const user = await this.userService.getByUserId(payload.sub)

      if (!user) {
        throw new UnauthorizedException()
      }

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { secret: process.env.JWT_SECRET },
      )
      return { accessToken }
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
