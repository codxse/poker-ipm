import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common'
import { UserService } from '@app/services/user.services'
import { PaginationDto } from '@app/dto/pagination.dto'

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getUsers(@Query() query: PaginationDto) {
    const res = await this.userService.getPaginatedUsers(query)

    if (!res) {
      throw new NotFoundException('No users found on this page')
    }

    return res
  }
}
