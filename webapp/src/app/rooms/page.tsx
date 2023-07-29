import { cookies } from 'next/headers'
import JoinRoomClient from '@app/rooms/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RoomsPage({ searchParams: { id } }) {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  const maybeId = id ? parseInt(id, 10) : id

  return (
    <>
      <h1 className="text-3xl md:text-5xl font-semibold text-stale-900 dark:text-white">
        Join a Room
      </h1>
      <JoinRoomClient
        token={accessToken}
        id={maybeId}
        className="flex flex-col w-full sm:w-2/4 md:w-3/4 lg:w-1/3 mt-4 md:mt-8"
      />
      <p className="inline-block text-md left">
        Or,{' '}
        <Link
          className="font-semibold inline-flex hover:text-blue-600 dark:hover:text-yellow-500 mt-4"
          href="/rooms/create"
          title="create a room"
        >
          Create a Room
          <ArrowRight className="ml-2" />
        </Link>
      </p>
    </>
  )
}
