import { useSession } from 'next-auth/react'

type User1 = User

export default useSession as unknown as () => ReturnType<typeof useSession> & {
  data?: { user: User1 & { id: string; sub: string } }
}
