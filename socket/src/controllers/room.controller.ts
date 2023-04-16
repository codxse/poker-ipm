import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common'
import { RoomService } from '@app/services/room.service'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { PositiveIntPipe } from '@app/pipes/positive-int.pipe'
import { AuthGuard } from '@nestjs/passport'
import { RequestWithUser } from '@app/interfaces/request-with-user.interface'
import { ThrowOnMissingResource } from '@app/decorators/throw-on-missing-resource.decorator'

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard('jwt'))
  @ThrowOnMissingResource('User is not exist')
  @Post('create')
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id
    return this.roomService.create(createRoomDto, userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @ThrowOnMissingResource('One or two resources is not exists')
  @Post('join/:id')
  async join(
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id
    return this.roomService.join(id, userId)
  }
}
