import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Param,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common'
import { UserService } from '@app/services/user.service'
import { PaginationDto } from '@app/dto/pagination.dto'
import { PositiveIntPipe } from '@app/pipes/positive-int.pipe'
import { ThrowOnMissingResource } from '@app/decorators/throw-on-missing-resource.decorator'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ThrowOnMissingResource('No users found on this page')
  async getUsers(@Query() query: PaginationDto) {
    return await this.userService.getPaginatedUsers(query)
  }

  @Get(':id')
  @ThrowOnMissingResource('User is not exists')
  async getByUserId(@Param('id', PositiveIntPipe) id: number) {
    return await this.userService.getByUserId(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto)
  }
}
