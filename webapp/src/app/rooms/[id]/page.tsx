import { cookies } from 'next/headers'
import RoomClient from '@app/rooms/[id]/client'

export default function ({ params: { id } }) {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  return <RoomClient token={accessToken} roomId={id} />
}
