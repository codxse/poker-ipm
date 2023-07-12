import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  ValidationPipe,
  UsePipes,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common'
import { RoomService } from '@app/services/room.service'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { PositiveIntPipe } from '@app/pipes/positive-int.pipe'
import { AuthGuard } from '@nestjs/passport'
import { RequestWithUser } from '@app/interfaces/request-with-user.interface'
import { JoinAs } from '@app/entities/participant.entity'

@Controller('api/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id
    return this.roomService.create(createRoomDto, userId)
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async join(
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Body() joinAs?: { joinAs: JoinAs }
  ) {
    // const now = new Date()
    const userId = parseInt(`${req.user.id}`, 10)
    const participant = await this.roomService.join(id, userId, joinAs?.joinAs)
    // const createdAt = new Date(participant.createdAt)
    // const alreadyJoined = createdAt.getTime() < now.getTime()

    // if (alreadyJoined) {
    //   throw new HttpException(
    //     'User is already a participant in the room',
    //     HttpStatus.BAD_REQUEST,
    //   )
    // }

    return participant
  }

  @Delete(':id/leave')
  @UseGuards(AuthGuard('jwt'))
  async leave(
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id
    return await this.roomService.leave(id, userId)
  }
}
