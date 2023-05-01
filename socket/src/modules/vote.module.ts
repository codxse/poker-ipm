import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VoteService } from '@app/services/vote.service'
import { Vote } from '@app/entities/vote.entity'
import { User } from '@app/entities/user.entity'
import { Story } from '@app/entities/story.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Vote, User, Story])],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
