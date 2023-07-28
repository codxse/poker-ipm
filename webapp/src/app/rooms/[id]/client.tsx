'use client'

import useSocket from '@lib/hook/use-socket'
import { useMutation } from 'react-query'
import { useEffect } from 'react'
import useStore from '@lib/hook/use-store'
import VoteOptionForm from '@components/vote-options-form'
import VoteOptions from '@components/vote-options'
import StoryForm from '@components/story-form'
import Stories from '@components/stories'
import Participant from '@components/participants'
import useSession from '@lib/hook/use-session'
import request from '@lib/request'
import { Socket } from 'socket.io-client'
import { useForm } from 'react-hook-form'
import useParticipant, { JoinAsEnum } from '@lib/hook/use-participant'

interface RoomDetailProps extends RoomClientProps {
  participants: Participant[]
}

interface LeaveRoomButtonProps extends RoomClientProps {
  socket: Socket
}

function LeaveRoomButton({ token, roomId, socket }: LeaveRoomButtonProps) {
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

      socket.emit('request/updateParticipants', newParticipants)
      window.location.replace(`/rooms?id=${roomId}`)
    }
  }, [mutation.isSuccess])

  if (participants.length === 0) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        value="Leave Room"
        type="submit"
        className="text-red-500 font-semibold hover:underline text-right"
        disabled={mutation.isLoading}
      />
    </form>
  )
}

export default function RoomClient({
  token,
  roomId,
  participants,
}: RoomDetailProps) {
  const socket = useSocket({ token, roomId })
  const { room, ...store } = useStore((store) => store)
  const iAm = useParticipant()
  const iAmObserver = iAm.joinAs === JoinAsEnum.OBSERVER

  useEffect(() => {
    store.updateParticipants(participants)
  }, [])

  useEffect(() => {
    if (socket) {
      socket.emit('request/updateParticipants', participants)
    }
  }, [socket, participants.length])

  useEffect(() => {
    if (socket) {
      socket.emit('request/initRoom', parseInt(roomId, 10))

      socket.on('response/initRoom', store.initRoom)
      socket.on('broadcast/updateParticipants', store.updateParticipants)
      socket.on('broadcast/deleteVoteOption', ({ deleted }) =>
        store.removeVoteOptionById(deleted),
      )
      socket.on('broadcast/createVoteOption', store.appendVoteOptions)
      socket.on('broadcast/createStory', store.appendStories)
      socket.on('broadcast/deleteStory', ({ deleted }) => {
        store.removeStoryById(deleted)
      })
      socket.on('broadcast/updateStory', store.updateStory)
      socket.on('broadcast/submitVoting', store.appendVotingById)
    }

    return function () {
      socket?.disconnect()
    }
  }, [socket])

  return (
    <>
      <LeaveRoomButton token={token} roomId={roomId} socket={socket!} />
      <div className="flex gap-4 w-full">
        {iAmObserver ? <VoteOptionForm token={token} roomId={roomId} /> : null}
        {iAmObserver ? <VoteOptions token={token} roomId={roomId} /> : null}
        <Participant />
      </div>
      {iAmObserver ? <StoryForm token={token} roomId={roomId} /> : null}
      <Stories token={token} roomId={roomId} />
      <pre>{JSON.stringify(room, null, 2)}</pre>
    </>
  )
}
