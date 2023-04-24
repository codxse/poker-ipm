import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs'
import { TRANSACTION_DECORATOR } from '@app/decorators/transaction.decorator'
import { DataSource } from 'typeorm'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private connection: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const target = context.getHandler()
    const isTransactional = Reflect.getMetadata(TRANSACTION_DECORATOR, target)

    if (!isTransactional) {
      return firstValueFrom(next.handle())
    }

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const result = await lastValueFrom(next.handle())
      await queryRunner.commitTransaction()
      return result
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
