import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RoomClient from '@app/rooms/[id]/client'
import request from '@lib/request'
import { getServerSession } from 'next-auth'
import authOptions from '@lib/auth-options'
import find from 'lodash/find'

export default async function ({ params: { id } }) {
  const accessToken = cookies().get('next-auth.session-token')?.value

  if (!accessToken) return

  const response = await request(
    `${process.env['NEXT_PUBLIC_API_ENDPOINT']}/api/participants?roomId=${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )
  const participants = (await response.json()) as Participant[]

  const session = (await getServerSession(authOptions)) as
    | { user?: User }
    | undefined

  if (!find(participants, { userId: session?.user?.id })) {
    redirect(`/rooms?id=${id}`)
  }

  return (
    <RoomClient token={accessToken} roomId={id} participants={participants} />
  )
}
