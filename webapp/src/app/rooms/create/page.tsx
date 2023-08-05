import { cookies } from 'next/headers'
import Client from '@app/rooms/create/client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function RoomCreatePage() {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  return (
    <>
      <h1 className="mt-12 md:mt-20 text-3xl md:text-5xl font-semibold text-stale-900 dark:text-white">
        Create a Room
      </h1>
      <Client
        token={accessToken}
        className="flex flex-col w-full sm:w-2/4 md:w-3/4 lg:w-1/3 mt-4 md:mt-8"
      />
      <p className="inline-block text-md left">
        Or,{' '}
        <Link
          className="font-semibold inline-flex hover:text-blue-600 dark:hover:text-yellow-500 mt-4"
          href="/rooms"
          title="Join a room"
        >
          join a room
          <ArrowRight className="ml-2" />
        </Link>
      </p>
    </>
  )
  return
}
