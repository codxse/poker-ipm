import Jwt from '@lib/jwt'
import jwt from 'jsonwebtoken'

const fakePayload = { id: 1, sub: 1 }
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

  describe('encode', () => {
    it('should encode a payload', () => {
      const accessToken = Jwt.encode(fakePayload, fakeSecret)

      expect(jwt.sign).toHaveBeenCalledWith(fakePayload, fakeSecret, {
        algorithm: Jwt._ALGORITHM_,
      })
      expect(accessToken).toBe(fakeToken)
    })

    it('shoud throw error if both id or sub are missing', () => {
       expect(() => Jwt.encode({}, fakeSecret)).toThrowError()
    })
  })

  describe('decode', () => {
    it('should decode a token', () => {
      const payload = Jwt.decode(fakeToken, fakeSecret)

      expect(jwt.verify).toHaveBeenCalledWith(fakeToken, fakeSecret, {
        algorithms: [Jwt._ALGORITHM_],
        complete: false,
      })
      expect(payload).toEqual(fakePayload)
    })

    it('should throw error if no token provided', () => {
      expect(() => Jwt.decode('', fakeSecret)).toThrowError()
    })
  })
})
