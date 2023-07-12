'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import VotingForm from '@components/voting-form'

function Title({ title, url }) {
  if (url) {
    return (
      <a href={url} title={title} target="_blank">
        {title}
      </a>
    )
  }

  return title
}

export default function Stories({ token, roomId }: RoomClientProps) {
  const socket = useSocket({ token, roomId })
  const stories = useStore((store) => store.room?.stories || [])
  const handleDelete = (id: VoteOption['id']) => {
    socket?.emit('request/deleteStory', id)
  }

  return (
    <ul>
      {stories.map(({ id, votes, title, url, description, isFinished }) => {
        return (
          <li key={id}>
            <p>
              <Title url={url} title={title} />
            </p>
            <p>Description: {description}</p>
            <p>isFinished: {isFinished.toString()}</p>
            <button onClick={() => handleDelete(id)}>Delete Story #{id}</button>

            <h1>Zehahaha</h1>
            <VotingForm token={token} roomId={roomId} storyId={id} />
          </li>
        )
      })}
    </ul>
  )
}
