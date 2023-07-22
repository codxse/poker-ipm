import { cookies } from 'next/headers'
import JoinRoomClient from '@app/rooms/client'

export default function ({ searchParams: { id } }) {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  const maybeId = id ? parseInt(id, 10) : id

  return <JoinRoomClient token={accessToken} id={maybeId} />
}
