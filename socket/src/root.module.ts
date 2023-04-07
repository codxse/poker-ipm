import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { RootController } from '@app/controllers/root.controller'
import { configOption } from '@app/typeorm.config';
import { UserModule } from '@app/modules/user.module'

@Module({
  imports: [TypeOrmModule.forRoot(configOption), UserModule],
  controllers: [RootController],
})
export class RootModule {}
