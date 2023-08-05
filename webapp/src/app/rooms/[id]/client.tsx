'use client'

import useSocket from '@lib/hook/use-socket'
import { useMutation } from 'react-query'
import { useEffect, useState } from 'react'
import useStore from '@lib/hook/use-store'
import VoteOptionForm from '@components/vote-options-form'
import StoryForm from '@components/story-form'
import Stories from '@components/stories'
import Participant from '@components/participants'
import LeaveRoomButton from '@components/leave-room-button'
import useSession from '@lib/hook/use-session'
import request from '@lib/request'
import { useForm } from 'react-hook-form'
import useParticipant, { JoinAsEnum } from '@lib/hook/use-participant'

interface RoomDetailProps extends RoomClientProps {
  participants: Participant[]
}

export default function RoomClient({
  token,
  roomId,
  participants,
}: RoomDetailProps) {
  const socket = useSocket({ token, roomId })
  const { room, ...store } = useStore((store) => store)
  const stories = room?.stories || []
  const iAm = useParticipant()
  const iAmObserver = iAm.joinAs === JoinAsEnum.OBSERVER

  const [showStoryForm, setShowStoryForm] = useState(false)
  const [showPointForm, setShowPointForm] = useState(false)

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
    <div className="relative h-full">
      <div className="flex w-full h-full gap-4">
        <aside className="w-64 flex flex-col gap-4">
          <button
            onClick={() => setShowStoryForm((prev) => !prev)}
            className="w-full bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:shadow-outline rounded font-bold py-2 px-4"
          >
            {stories.length === 0 ? 'New story' : 'Next story'}
          </button>
          <button
            onClick={() => setShowPointForm((prev) => !prev)}
            className="w-full bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:shadow-outline rounded font-bold py-2 px-4"
          >
            New point
          </button>
          <Participant />
          <LeaveRoomButton token={token} roomId={roomId} />
        </aside>
        <section className="w-full h-full bg-slate-100 rounded-xl">
          <Stories
            className="border rounded p-4 flex flex-col gap-4"
            token={token}
            roomId={roomId}
          />
          {/* <pre>{JSON.stringify(room, null, 2)}</pre> */}
        </section>
      </div>
      {iAmObserver ? (
        <div className="flex justify-end fixed bottom-0 right-0 w-full">
          <div className="relative w-full mr-4 ">
            <VoteOptionForm
              className={`${
                showPointForm
                  ? 'flex gap-2 w-fit h-fit dark:bg-gray-800 bg-white rounded-t border absolute bottom-0 right-0 border-gray-300 dark:border-gray-700 shadow-md'
                  : 'hidden'
              }`}
              token={token}
              roomId={roomId}
            />
          </div>
          <StoryForm
            className={`${
              showStoryForm
                ? 'flex flex-col mb-0 w-1/3 mr-4 dark:bg-gray-800 bg-white rounded-t border border-gray-300 dark:border-gray-700 shadow-md'
                : 'hidden'
            }`}
            token={token}
            roomId={roomId}
          />
        </div>
      ) : null}
    </div>
  )
}
