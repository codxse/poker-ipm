import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Credential from '@lib/credential'
import Jwt from '@lib/jwt'

const handler = NextAuth({
  secret: process.env.JWT_SECRET,
  jwt: {
    encode({ token: payload = {}, secret }) {
      return Jwt.encode(payload, secret as string)
    },
    decode({ token: accessToken = '', secret }) {
      return Jwt.decode(accessToken, secret as string)
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
      return {
        ...params.token,
        ...params.user,
      }
    },
    async session({ session, token: user }) {
      session.user = user
      return session
    },
  },
})

export { handler as GET, handler as POST }
