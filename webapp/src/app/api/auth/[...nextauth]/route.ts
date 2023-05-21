import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Credential from '@lib/credential'
import Jwt from '@lib/jwt'
import { JwtPayload } from 'jsonwebtoken'

const handler = NextAuth({
  secret: process.env.JWT_SECRET,
  jwt: {
    encode({ token: payload = {}, secret }) {
      return Jwt.encode(payload, secret as string)
    },
    decode({ token: accessToken, secret }) {
      try {
        const jwtPayload = Jwt.decode(accessToken!, secret as string)
        return Promise.resolve(jwtPayload) as JwtPayload
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
      const identity = `${params.token?.sub || params.user.id}`
      return {
        ...params.token,
        ...params.user,
        id: identity,
        sub: identity,
      }
    },
    async session({ session, token: user }) {
      session.user = user
      return session
    },
  },
})

export { handler as GET, handler as POST }
