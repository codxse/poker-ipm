import * as jwt from 'jsonwebtoken'
import Credential, { SessionUser } from '@libs/credential'

jest.mock('jsonwebtoken')

const { Response } = jest.requireActual('node-fetch')

describe('Credential', () => {
  const fakeAccessToken = 'fakeToken'
  const fakeJwtPayload = { sub: '123' }
  const fakeUser: SessionUser = {
    id: fakeJwtPayload.sub,
    createdAt: '2021-12-31T23:59:59.999Z',
    updatedAt: '2021-12-31T23:59:59.999Z',
    email: 'test@example.com',
    isVerified: true,
  }

  beforeEach(() => {
    ;(jwt.decode as jest.Mock).mockReturnValue(fakeJwtPayload)
    ;(fetch as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(JSON.stringify(fakeUser), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return null if accessToken is not provided', async () => {
    const credential = new Credential({})
    const result = await credential.authorize()
    expect(result).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(0)
  })

  it('should return null if request fails', async () => {
    ;(fetch as jest.Mock).mockReturnValueOnce(Promise.reject('API is down'))
    const credential = new Credential({ accessToken: fakeAccessToken })
    const result = await credential.authorize()
    expect(result).toBeNull()
  })

  it('should return user if accessToken is provided and request is successful', async () => {
    const credential = new Credential({ accessToken: fakeAccessToken })
    const result = await credential.authorize()

    expect(jwt.decode).toHaveBeenCalledWith(fakeAccessToken, {
      complete: false,
    })
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${fakeJwtPayload.sub}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fakeAccessToken}`,
        },
      },
    )
    expect(result).toEqual(fakeUser)
  })
})
