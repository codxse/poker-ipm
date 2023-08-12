import { NestFactory } from '@nestjs/core'
import { RootModule } from '@app/root.module'
import { ValidationPipe } from '@nestjs/common'
import { corsOptions } from './utils/cors'

async function bootstrap() {
  const app = await NestFactory.create(RootModule)
  app.enableCors(corsOptions)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5000)
}
bootstrap()
