import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@app/services/user.service'
import { CreateUserDto } from '@app/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(): Promise<void> {
    // Todo
  }

  async signIn(): Promise<{ accessTolken: string }> {
    // Todo
    return {
      accessTolken: '',
    }
  }

  async registerGoogleUser(user: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(user.email)

    if (existingUser) return existingUser

    return this.userService.createUser(user)
  }
}
