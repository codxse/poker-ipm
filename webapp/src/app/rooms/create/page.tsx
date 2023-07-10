import { cookies } from 'next/headers'
import RoomCreateClient from '@app/rooms/create/client'

export default function () {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  return <RoomCreateClient token={accessToken} />
}
