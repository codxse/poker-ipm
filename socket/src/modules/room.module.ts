import { Module } from '@nestjs/common'
import { RoomService } from '@app/services/room.service'
import { RoomController } from '@app/controllers/room.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '@app/entities/room.entity'
import { User } from '@app/entities/user.entity'
import { Participant } from '@app/entities/participant.entity'
import { ParticipantService } from '@app/services/participant.service'
import { StoryModule } from '@app/modules/story.module'
import { VoteOptionModule } from '@app/modules/vote-option.module'
import { VoteModule } from '@app/modules/vote.module'
import { VotingModule } from '@app/modules/voting.module'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './user.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, User, Participant]),
    PassportModule,
    JwtModule,
    UserModule,
    RoomModule,
    StoryModule,
    VoteOptionModule,
    VoteModule,
    VotingModule,
  ],
  providers: [RoomService, ParticipantService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
