import { Controller, Get } from '@nestjs/common';
import { UserService } from '@app/services/user.services'
import { User } from '@app/entities/user.entity';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}