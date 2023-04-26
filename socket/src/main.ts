import { NestFactory } from '@nestjs/core'
import { RootModule } from '@app/root.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(RootModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5000)
}
bootstrap()
