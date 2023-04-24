import { Test } from '@nestjs/testing'
import { TransactionInterceptor } from '@app/interceptors/transaction.interceptor'
import { ExecutionContext, CallHandler } from '@nestjs/common'
import { QueryRunner, DataSource } from 'typeorm'
import { of } from 'rxjs'
import { TRANSACTION_DECORATOR } from '@app/decorators/transaction.decorator'

describe('TransactionInterceptor', () => {
  let interceptor: TransactionInterceptor
  let connection: DataSource
  let queryRunner: QueryRunner

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionInterceptor,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          },
        },
      ],
    }).compile()

    interceptor = moduleRef.get<TransactionInterceptor>(TransactionInterceptor)
    connection = moduleRef.get<DataSource>(DataSource)
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as any
    ;(connection.createQueryRunner as jest.Mock).mockImplementation(
      () => queryRunner,
    )
  })

  it('should not use transaction if handler is not decorated with @Transaction', async () => {
    const context: ExecutionContext = {
      getHandler: () => () => {
        // Ignore linter, intended empty
      },
    } as any
    const next: CallHandler = {
      handle: () => of('test'),
    } as any

    const result = await interceptor.intercept(context, next)

    expect(result).toBe('test')
    expect(connection.createQueryRunner).not.toBeCalled()
  })

  it('should use transaction if handler is decorated with @Transaction', async () => {
    const target = () => {
      // Ignore linter, intended empty
    }
    Reflect.defineMetadata(TRANSACTION_DECORATOR, true, target)

    const context: ExecutionContext = {
      getHandler: () => target,
    } as any
    const next: CallHandler = {
      handle: () => of('test'),
    } as any

    const result = await interceptor.intercept(context, next)

    expect(result).toBe('test')
    expect(connection.createQueryRunner).toBeCalled()
    expect(queryRunner.connect).toBeCalled()
    expect(queryRunner.startTransaction).toBeCalled()
    expect(queryRunner.commitTransaction).toBeCalled()
    expect(queryRunner.release).toBeCalled()
  })

  it('should rollback transaction if an error occurs', async () => {
    const target = () => {
      // Ignore linter, intended empty
    }
    Reflect.defineMetadata(TRANSACTION_DECORATOR, true, target)

    const context: ExecutionContext = {
      getHandler: () => target,
    } as any
    const next: CallHandler = {
      handle: () => {
        throw new Error('test error')
      },
    } as any

    await expect(interceptor.intercept(context, next)).rejects.toThrow(
      'test error',
    )
    expect(connection.createQueryRunner).toBeCalled()
    expect(queryRunner.connect).toBeCalled()
    expect(queryRunner.startTransaction).toBeCalled()
    expect(queryRunner.rollbackTransaction).toBeCalled()
    expect(queryRunner.release).toBeCalled()
  })
})
