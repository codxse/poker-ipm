import { BadRequestException } from '@nestjs/common'
import { PositiveIntPipe } from '@app/pipes/positive-int.pipe'

describe('PositiveIntPipe', () => {
  let positiveIntPipe: PositiveIntPipe

  beforeEach(() => {
    positiveIntPipe = new PositiveIntPipe()
  })

  it('should successfully transform a positive integer string', () => {
    const value = '42'
    const result = positiveIntPipe.transform(value, {
      type: 'param',
      data: 'id',
    })
    expect(result).toEqual(42)
  })

  it('should throw a BadRequestException for a non-integer value', () => {
    const value = '42.5'
    expect(() =>
      positiveIntPipe.transform(value, { type: 'param', data: 'id' }),
    ).toThrow(BadRequestException)
  })

  it('should throw a BadRequestException for a negative integer value', () => {
    const value = '-42'
    expect(() =>
      positiveIntPipe.transform(value, { type: 'param', data: 'id' }),
    ).toThrow(BadRequestException)
  })

  it('should throw a BadRequestException for a non-numeric value', () => {
    const value = 'abc'
    expect(() =>
      positiveIntPipe.transform(value, { type: 'param', data: 'id' }),
    ).toThrow(BadRequestException)
  })
})
