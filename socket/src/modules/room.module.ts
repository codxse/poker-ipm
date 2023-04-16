import { Module } from '@nestjs/common'
import { RoomService } from '@app/services/room.service'
import { RoomController } from '@app/controllers/room.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '@app/entities/room.entity'
import { User } from '@app/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Room, User])],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
