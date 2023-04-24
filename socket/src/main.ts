import { NestFactory } from '@nestjs/core'
import { RootModule } from '@app/root.module'
import { ValidationPipe } from '@nestjs/common'
import { TransactionInterceptor } from './interceptors/transaction.interceptor'
import config from '@app/typeorm.config'
import { getEntityManagerToken } from '@nestjs/typeorm'

async function bootstrap() {
  const app = await NestFactory.create(RootModule)
  app.useGlobalPipes(new ValidationPipe())
  const token = getEntityManagerToken(config)
  app.useGlobalInterceptors(new TransactionInterceptor(app.get(token)))
  await app.listen(5000)
}
bootstrap()
