import Jwt from '@lib/jwt'
import jwt from 'jsonwebtoken'

const fakePayload = { userId: 1 }
const fakeToken = 'fakeToken'

jest.mock('jsonwebtoken', () => {
  return {
    verify: jest.fn(() => fakePayload),
    sign: jest.fn(() => fakeToken),
  }
})

describe('Jwt', () => {
  const fakeSecret = 'fakeSecret'

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should encode a payload', () => {
    const accessToken = Jwt.encode(fakePayload, fakeSecret)

    expect(jwt.sign).toHaveBeenCalledWith(fakePayload, fakeSecret, {
      algorithm: Jwt._ALGORITHM_,
    })
    expect(accessToken).toBe(fakeToken)
  })

  it('should decode a token', () => {
    const payload = Jwt.decode(fakeToken, fakeSecret)

    expect(jwt.verify).toHaveBeenCalledWith(fakeToken, fakeSecret, {
      algorithms: [Jwt._ALGORITHM_],
      complete: false,
    })
    expect(payload).toEqual(fakePayload)
  })

  it('should return undefined if no token provided', () => {
    expect(() => Jwt.decode('', fakeSecret)).toThrowError()
  })
})
