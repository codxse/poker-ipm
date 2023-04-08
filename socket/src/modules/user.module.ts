import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from '@app/controllers/user.controller'
import { UserService } from '@app/services/user.services'
import { User } from '@app/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
