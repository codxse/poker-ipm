'use client'

import useSocket from '@lib/hook/use-socket'
import { useMutation } from 'react-query'
import { useEffect } from 'react'
import useStore from '@lib/hook/use-store'
import useSession from '@lib/hook/use-session'
import request from '@lib/request'
import { useForm } from 'react-hook-form'
import useParticipant from '@lib/hook/use-participant'

interface LeaveRoomButtonProps extends RoomClientProps {}

export default function LeaveRoomButton({
  token,
  roomId,
}: LeaveRoomButtonProps) {
  const socket = useSocket({ token, roomId })
  const seasson = useSession()
  const participants = useStore((store) => store.room?.participants || [])
  const {
    formState: { errors },
    handleSubmit,
  } = useForm()
  const mutation = useMutation<Participant, Error, any, any>(
    async (participant) => {
      const res = await request(
        `${process.env['NEXT_PUBLIC_API_ENDPOINT']}/api/participants/leave`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(participant),
        },
      )

      return (await res.json()) as Participant
    },
  )

  const iAm = useParticipant()
  const onSubmit = () => mutation.mutate(iAm)

  useEffect(() => {
    if (mutation.isSuccess) {
      const newParticipants = participants.filter(
        (p) => p.userId !== seasson.data.user.id,
      )

      socket?.emit('request/updateParticipants', newParticipants)
      window.location.replace(`/rooms?id=${roomId}`)
    }
  }, [mutation.isSuccess])

  if (participants.length === 0) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-center">
      <input
        value="Leave the Room"
        type="submit"
        className="text-red-500 font-semibold hover:underline text-right cursor-pointer"
        disabled={mutation.isLoading}
      />
    </form>
  )
}
