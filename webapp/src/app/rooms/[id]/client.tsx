'use client'

import useSocket from '@lib/hook/use-socket'
import { useEffect } from 'react'
import useStore from '@lib/hook/use-store'
import VoteOptionForm from '@components/vote-options-form'
import VoteOptions from '@components/vote-options'
import StoryForm from '@components/story-form'
import Stories from '@components/stories'

export default function RoomClient(props: RoomClientProps) {
  const socket = useSocket({ token: props.token, roomId: props.roomId })
  const { room, ...store } = useStore((store) => store)

  useEffect(() => {
    if (!socket) return

    socket.emit('request/initRoom', parseInt(props.roomId, 10))

    socket.on('response/initRoom', store.initRoom)
    socket.on('broadcast/deleteVoteOption', ({ deleted }) =>
      store.removeVoteOptionById(deleted),
    )
    socket.on('broadcast/createVoteOption', store.appendVoteOptions)
    socket.on('broadcast/createStory', store.appendStories)
    socket.on('broadcast/deleteStory', ({ deleted }) => {
      store.removeStoryById(deleted)
    })
    socket.on('broadcast/submitVoting', store.appendVotingById)

    return function () {
      socket.disconnect()
    }
  }, [socket])

  return (
    <div>
      <VoteOptionForm {...props} />
      <VoteOptions {...props} />
      <br />
      <StoryForm {...props} />
      <Stories {...props} />
      <pre>{JSON.stringify(room, null, 2)}</pre>
    </div>
  )
}
