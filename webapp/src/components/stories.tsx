'use client'

import { Fragment, useState } from 'react'
import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import VotingButtons from '@components/voting-buttons'
import PlayerVotes from '@components/player-votes'

function Title({ title, url }) {
  if (url) {
    return (
      <a
        className="block font-bold text-lg text-gray-600"
        href={url}
        title={title}
        target="_blank"
      >
        <h2>{title}</h2>
      </a>
    )
  }

  return <h2 className="block font-bold text-lg text-gray-600">{title}</h2>
}

interface ActiveStoryProps extends RoomClientProps {
  story?: Story
}

function ActiveStory(props: ActiveStoryProps) {
  const socket = useSocket({ token: props.token, roomId: props.roomId })

  if (!props?.story) return null

  const handleDelete = (id: VoteOption['id']) => {
    socket?.emit('request/deleteStory', id)
  }

  const finishStory = (storyId: Story['id']) => {
    socket?.emit('request/updateStory', { id: storyId, isFinished: !story.isFinished })
  }

  const { story } = props
  return (
    <div className="w-full border p-2">
      <span className="block text-sm font-semibold text-gray-700">title</span>
      <Title title={story.title} url={story?.url} />
      <p>{story.description}</p>

      <p>isFinished: {story.isFinished.toString()}</p>
      <button onClick={() => handleDelete(story.id)}>
        Delete Story #{story.id}
      </button>
      <button onClick={() => finishStory(story.id)}>
        Finish Story #{story.id}
      </button>

      <VotingButtons
        token={props.token}
        roomId={props.roomId}
        storyId={story.id}
      />
      <PlayerVotes
        key={story.id}
        token={props.token}
        roomId={props.roomId}
        votes={story.votes}
      />
    </div>
  )
}

export default function Stories({ token, roomId }: RoomClientProps) {
  const stories = useStore((store) => store.room?.stories || [])
  const [activeStoryId, setActiveStoryId] = useState(stories[0]?.id)
  const activeStory = activeStoryId
    ? stories.find((s) => s.id === activeStoryId)
    : stories[0]

  return (
    <section className="border rounded p-4 flex gap-4">
      <ul className="w-28 border p-2">
        {stories.map(({ id, title }) => (
          <button
            key={id}
            onClick={() => setActiveStoryId(id)}
            className="border p-1 w-full text-left"
          >
            <p>#{id}</p>
            <p className="truncate block">{title}</p>
          </button>
        ))}
      </ul>
      <ActiveStory story={activeStory} token={token} roomId={roomId} />
    </section>
  )
}
