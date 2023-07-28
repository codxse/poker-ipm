import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParticipantController } from '@app/controllers/participant.controller'
import { ParticipantService } from '@app/services/participant.service'
import { Participant } from '@app/entities/participant.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService, TypeOrmModule],
})
export class ParticipantModule {}
