import { ResponseTransformerInterceptor } from '@app/interceptors/response-transformer.interceptor'
import { ExecutionContext, CallHandler } from '@nestjs/common'
import { of } from 'rxjs'
import { Exclude } from 'class-transformer'

class TestClass {
  id = 1

  @Exclude()
  password = 'secret'
}

describe('ResponseTransformerInterceptor', () => {
  let interceptor: ResponseTransformerInterceptor
  let executionContext: ExecutionContext
  let next: CallHandler

  beforeEach(() => {
    interceptor = new ResponseTransformerInterceptor()
    executionContext = {} as ExecutionContext
    next = {
      handle: jest.fn().mockImplementation(() => of(new TestClass())),
    } as CallHandler
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should exclude properties with @Exclude() decorator', (done) => {
    const result$ = interceptor.intercept(executionContext, next)
    result$.subscribe({
      next: (value) => {
        expect(value).toEqual({ id: 1 })
        expect(value).not.toHaveProperty('password')
        done()
      },
      error: () => done.fail('Unexpected error'),
    })
  })
})
