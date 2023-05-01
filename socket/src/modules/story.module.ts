import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoryService } from '@app/services/story.service'
import { Story } from '@app/entities/story.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
