import { Injectable } from '@nestjs/common'
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

  async signIn(user: User): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    }

    const accessToken = await this.jwtService.sign(payload)
    return { accessToken }
  }
}
