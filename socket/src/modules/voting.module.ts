import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VotingService } from '@app/services/voting.service'
import { Voting } from '@app/entities/voting.entity'
import { VoteOption } from '@app/entities/vote-option.entity'
import { Vote } from '@app/entities/vote.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Voting, Vote, VoteOption])],
  providers: [VotingService],
  exports: [VotingService],
})
export class VotingModule {}
