import CredentialsProvider from 'next-auth/providers/credentials'
import Credential from '@lib/credential'
import Jwt from '@lib/jwt'
import * as jsonwebtoken from 'jsonwebtoken'
import { JWTDecodeParams, JWTEncodeParams } from 'next-auth/jwt'

const authOptions = {
  secret: process.env.JWT_SECRET,
  jwt: {
    encode({ token: payload = {}, secret }: JWTEncodeParams) {
      return Jwt.encode(payload, secret as string)
    },
    decode({ token: accessToken, secret }: JWTDecodeParams) {
      try {
        const jwtPayload = Jwt.decode(accessToken!, secret as string)
        return Promise.resolve(jwtPayload) as jsonwebtoken.JwtPayload
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(_, req) {
        const accessToken = req.query?.accessToken
        const credential = new Credential({ accessToken: accessToken })

        return credential.authorize()
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      const identity = parseInt(`${params.token?.sub || params.user.id}`, 10)
      return {
        ...params.token,
        ...params.user,
        id: identity,
        sub: identity,
      } as jsonwebtoken.JwtPayload & User & { id: number; sub: number }
    },
    async session({ session, token: user }) {
      session.user = user
      return session
    },
  },
}

export default authOptions
