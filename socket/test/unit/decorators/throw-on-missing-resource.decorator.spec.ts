import { NotFoundException } from '@nestjs/common'
import { ThrowOnMissingResource } from '@app/decorators/throw-on-missing-resource.decorator'

describe('ThrowOnMissingResource', () => {
  class TestClass {
    @ThrowOnMissingResource('Resource not found')
    testMethod(resource) {
      return resource
    }
  }

  let testClassInstance: TestClass

  beforeEach(() => {
    testClassInstance = new TestClass()
  })

  it('should not throw an exception if the resource is present', async () => {
    const resource = { id: 1, name: 'Sample Resource' }

    expect(() => testClassInstance.testMethod(resource)).not.toThrow()
    expect(await testClassInstance.testMethod(resource)).toEqual(resource)
  })

  it('should throw a NotFoundException if the resource is null', async () => {
    const resource = null

    await expect(testClassInstance.testMethod(resource)).rejects.toThrow(
      new NotFoundException('Resource not found'),
    )
  })

  it('should throw a NotFoundException if the resource is undefined', async () => {
    const resource = undefined

    expect(() => testClassInstance.testMethod(resource)).rejects.toThrow(
      new NotFoundException('Resource not found'),
    )
  })
})
