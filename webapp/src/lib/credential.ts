import * as jwt from 'jsonwebtoken'
import { DefaultUser } from 'next-auth'

export interface CredentialParams {
  accessToken?: string
}

export interface SessionUser extends DefaultUser {
  avatarUrl?: string
  createdAt: string
  updatedAt: string
  email: string
  firstName?: string
  lastName?: string
  username?: string
  isVerified: boolean
}

export default class Credential {
  private readonly accessToken?: string

  constructor(params: CredentialParams) {
    this.accessToken = params.accessToken
  }

  async authorize() {
    if (!this.accessToken) return null

    const payload = jwt.decode(this.accessToken, {
      complete: false,
    }) as jwt.JwtPayload

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${payload.sub}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      if (res.status >= 200 && res.status < 300) {
        const user: SessionUser = await res.json()

        return user
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to authorize:', e)
    }

    return null
  }
}
