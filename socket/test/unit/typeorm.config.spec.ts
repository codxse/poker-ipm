import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configOption } from '@app/typeorm.config'
import { getDataSourceToken } from '@nestjs/typeorm'

describe('TypeORM Integration', () => {
  let testingModule: TestingModule
  let dataSourceToken: any

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync({ useFactory: () => configOption })],
    }).compile()

    dataSourceToken = getDataSourceToken(configOption)
  })

  afterAll(async () => {
    await testingModule.close()
  })

  it('should establish a database connection', async () => {
    const connection = testingModule.get(dataSourceToken)
    expect(connection.isInitialized).toBe(true)
  })

  it('should close the database connection', async () => {
    await testingModule.close()
    const connection = testingModule.get(dataSourceToken)
    expect(connection.isInitialized).toBe(false)
  })
})
