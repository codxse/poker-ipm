import Provider from '@components/provider'
import authOptions from '@lib/auth-options'
import { getServerSession } from 'next-auth'

export const metadata = {
  title: 'IPM poker - Join a room',
  description: 'A man`s got to play the hand',
}
export default async function ({ children }: { children: React.ReactNode }) {
  const session: { user: User } | null = await getServerSession(authOptions)

  return (
    <Provider session={session}>
      <main className="px-4 md:px-16 flex-1">{children}</main>
    </Provider>
  )
}
