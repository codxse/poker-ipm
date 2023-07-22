import Link from 'next/link'
import LoginWithGoogleLink from '@components/login-with-google-link'
import authOptions from '@lib/auth-options'
import { getServerSession } from 'next-auth'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const session = (await getServerSession(authOptions)) as
    | { user?: User }
    | undefined

  return (
    <main className="flex min-h-screen flex-col justify-between p-4 md:p-24">
      <section className="flex flex-col border rounded-md p-2">
        <LoginWithGoogleLink
          className="hover:text-red-500 mb-8 hover:cursor-pointer"
          session={session}
        />
        {session?.user?.id && (
          <>
            <Link
              className="inline-flex hover:text-blue-600"
              href="/rooms"
              title="Create a Room"
            >
              <ArrowRight className="mr-2" />
              Join a Room
            </Link>
            <Link
              className="inline-flex hover:text-blue-600"
              href="/rooms/create"
              title="Create a Room"
            >
              <ArrowRight className="mr-2" />
              Create a Room
            </Link>
          </>
        )}
      </section>
    </main>
  )
}
