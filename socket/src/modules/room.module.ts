import { Module } from '@nestjs/common'
import { RoomService } from '@app/services/room.service'
import { RoomController } from '@app/controllers/room.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '@app/entities/room.entity'
import { User } from '@app/entities/user.entity'
import { Participant } from '@app/entities/participant.entity'
import { ParticipantService } from '@app/services/participant.service'
import { JwtService as JwtAuthService } from '@app/services/jwt.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './user.module'
import { RoomGateway } from '@app/gateways/impl/room.gateway.impl'
import { StoryModule } from './story.module'
import { VoteOptionModule } from './vote-option.module'
import { VoteModule } from './vote.module'
import { VotingModule } from './voting.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([Room, User, Participant]),
    PassportModule,
    JwtModule,
    UserModule,
    StoryModule,
    VoteOptionModule,
    VoteModule,
    VotingModule,
  ],
  providers: [RoomService, ParticipantService, JwtAuthService, RoomGateway],
  controllers: [RoomController],
  exports: [RoomService, RoomGateway],
})
export class RoomModule {}
