import {
  Transaction,
  TRANSACTION_DECORATOR,
} from '@app/decorators/transaction.decorator'
import 'reflect-metadata'

describe('Transaction Decorator', () => {
  class TestClass {
    @Transaction()
    decoratedMethod() {
      // Ignore linter, intended empty
    }

    undecoratedMethod() {
      // Ignore linter, intended empty
    }
  }

  it('should set TRANSACTION_DECORATOR metadata for decorated method', () => {
    const target = new TestClass()
    const decoratedMetadata = Reflect.getMetadata(
      TRANSACTION_DECORATOR,
      target.decoratedMethod,
    )
    expect(decoratedMetadata).toBe(true)
  })

  it('should not set TRANSACTION_DECORATOR metadata for undecorated method', () => {
    const target = new TestClass()
    const undecoratedMetadata = Reflect.getMetadata(
      TRANSACTION_DECORATOR,
      target.undecoratedMethod,
    )
    expect(undecoratedMetadata).toBeUndefined()
  })
})
