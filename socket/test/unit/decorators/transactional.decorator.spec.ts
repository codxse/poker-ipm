import { Test } from '@nestjs/testing'
import { Transactional } from '@app/decorators/transactional.decorator'
import { getEntityManagerToken } from '@nestjs/typeorm'
import { DataSource, EntityManager, QueryRunner } from 'typeorm'

class TestClass {
  constructor(private readonly manager: EntityManager) {}

  @Transactional()
  async testMethod() {
    return 'Test Result'
  }

  async testMethodWithoutDecorator() {
    // intended blank
  }
}

describe('Transactional', () => {
  let testInstance: TestClass

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),
  } as unknown as QueryRunner

  const mockDataSource: Partial<DataSource> = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  }

  const mockEntityManager = new EntityManager(mockDataSource as any)

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        {
          provide: getEntityManagerToken(),
          useValue: mockEntityManager,
        },
      ],
    }).compile()

    testInstance = new TestClass(mockEntityManager)
  })

  it('should not call the transaction methods on the queryRunner if decorator not provided', async () => {
    await testInstance.testMethodWithoutDecorator()

    expect(mockDataSource.createQueryRunner().connect).not.toHaveBeenCalled()
    expect(
      mockDataSource.createQueryRunner().startTransaction,
    ).not.toHaveBeenCalled()
    expect(
      mockDataSource.createQueryRunner().commitTransaction,
    ).not.toHaveBeenCalled()
    expect(
      mockDataSource.createQueryRunner().rollbackTransaction,
    ).not.toHaveBeenCalled()
    expect(mockDataSource.createQueryRunner().release).not.toHaveBeenCalled()
  })

  it('should call the transaction methods on the queryRunner', async () => {
    const result = await testInstance.testMethod()

    const queryRunner = mockDataSource.createQueryRunner()

    expect(queryRunner.connect).toHaveBeenCalled()
    expect(queryRunner.startTransaction).toHaveBeenCalled()
    expect(queryRunner.commitTransaction).toHaveBeenCalled()
    expect(queryRunner.release).toHaveBeenCalled()
    expect(result).toBe('Test Result')
  })
})
