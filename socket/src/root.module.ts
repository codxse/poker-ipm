import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { RootController } from '@app/controllers/root.controller'
import { configOption } from '@app/typeorm.config'
import { UserModule } from '@app/modules/user.module'
import { ResponseTransformerInterceptor } from '@app/interceptors/response-transformer.interceptor'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [TypeOrmModule.forRoot(configOption), UserModule],
  controllers: [RootController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformerInterceptor,
    },
  ],
})
export class RootModule {}
