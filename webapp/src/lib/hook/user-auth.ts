import { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { SessionUser } from '@lib/credential'

export default function useAuth(params: { accessToken: string }) {
  const [user, setUser] = useState<SessionUser>()

  useEffect(() => {
    signIn(
      'credentials',
      { redirect: false },
      {
        accessToken: params.accessToken,
      },
    )
  }, [params.accessToken])

  return user
}
