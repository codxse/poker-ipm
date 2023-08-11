import { NestFactory } from '@nestjs/core'
import { RootModule } from '@app/root.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(RootModule)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://api.ipm.poker', 'https://ipm.poker']
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5000)
}
bootstrap()
