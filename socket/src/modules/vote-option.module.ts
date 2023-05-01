import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VoteOptionService } from '@app/services/vote-option.service'
import { VoteOption } from '@app/entities/vote-option.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VoteOption])],
  providers: [VoteOptionService],
  exports: [VoteOptionService],
})
export class VoteOptionModule {}
