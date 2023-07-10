import { cookies } from 'next/headers'
import JoinRoomClient from '@app/rooms/client'

export default function () {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  return <JoinRoomClient token={accessToken} />
}
