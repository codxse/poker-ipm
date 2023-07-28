import {
  Controller,
  Get,
  ValidationPipe,
  Post,
  UsePipes,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common'
import { ParticipantService } from '@app/services/participant.service'
import { PositiveIntPipe } from '@app/pipes/positive-int.pipe'
import { AuthGuard } from '@nestjs/passport'
import { Participant } from '@app/entities/participant.entity'

@Controller('api/participants')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getParticipantsByRoomId(
    @Query('roomId', PositiveIntPipe) roomId: number,
  ) {
    return await this.participantService.getByRoomId(roomId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('leave')
  async leave(@Body() participant: Participant) {
    await this.participantService.remove(participant)
    return {
      ...participant,
      deleted: true,
    }
  }
}
