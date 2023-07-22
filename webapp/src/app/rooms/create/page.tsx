import { cookies } from 'next/headers'
import Client from '@app/rooms/create/client'

export default function RoomCreatePage() {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  return <Client token={accessToken} />
}
