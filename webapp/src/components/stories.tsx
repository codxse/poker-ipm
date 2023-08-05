'use client'

import { useEffect, useState } from 'react'
import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import findLastIndex from 'lodash/findLastIndex'
import findIndex from 'lodash/findIndex'
import VotingButtons from '@components/voting-buttons'
import PlayerVotes from '@components/player-votes'
import useParticipant, { JoinAsEnum } from '@lib/hook/use-participant'

import { ChevronLeft, ChevronRight } from 'lucide-react'

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

interface DeleteStoryButtonProps {
  story: Story
  onDelete(): void
}

function DeleteStoryButton({ onDelete, story }: DeleteStoryButtonProps) {
  return <button onClick={onDelete}>Delete Story #{story.id}</button>
}

interface FinishStoryButtonProps {
  story: Story
  onFinish(): void
}

function FinishStoryButton({ onFinish, story }: FinishStoryButtonProps) {
  return <button onClick={onFinish}>Finish Story #{story.id}</button>
}

interface ActiveStoryProps extends RoomClientProps {
  story?: Story
}

function ActiveStory(props: ActiveStoryProps) {
  const socket = useSocket({ token: props.token, roomId: props.roomId })
  const iAm = useParticipant()
  const iAmObserver = iAm.joinAs === JoinAsEnum.OBSERVER

  if (!props?.story) return null

  const handleDelete = (id: VoteOption['id']) => {
    socket?.emit('request/deleteStory', id)
  }

  const finishStory = (storyId: Story['id']) => {
    socket?.emit('request/updateStory', {
      id: storyId,
      isFinished: !story.isFinished,
    })
  }

  const { story } = props
  return (
    <div className="w-full border p-2">
      <span className="block text-sm font-semibold text-gray-700">title</span>
      <Title title={story.title} url={story?.url} />
      <p>{story.description}</p>

      <p>isFinished: {story.isFinished.toString()}</p>
      {iAmObserver ? (
        <DeleteStoryButton
          story={story}
          onDelete={() => handleDelete(story.id)}
        />
      ) : null}
      {iAmObserver ? (
        <FinishStoryButton
          story={story}
          onFinish={() => finishStory(story.id)}
        />
      ) : null}

      <VotingButtons
        token={props.token}
        roomId={props.roomId}
        storyId={story.id}
        disabled={story.isFinished}
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

interface StoriesProps extends RoomClientProps {
  className?: string
}

interface NavigationProps {
  stories: Story[]
  activeStory?: Story
  setActiveStoryId(storyId: number): void
}

function Navigation({
  stories,
  activeStory,
  setActiveStoryId,
}: NavigationProps) {
  const activeIndex = findIndex(stories, { id: activeStory?.id })

  if (stories.length === 0) return null

  const nextStory = stories[activeIndex + 1]
  if (activeIndex === 0 && stories.length > 1) {
    return (
      <>
        <button
          onClick={() => setActiveStoryId(nextStory.id)}
          className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft />
          <span>{nextStory?.title}</span>
        </button>
        <div className="flex-1" />
      </>
    )
  }

  const lastIndex = findLastIndex(stories)
  const prevStory = stories[activeIndex - 1]
  if (activeIndex === lastIndex) {
    return (
      <>
        <div className="flex-1" />
        <button
          onClick={() => setActiveStoryId(prevStory.id)}
          className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700 justify-end"
        >
          <span>{prevStory?.title}</span>
          <ChevronRight />
        </button>
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setActiveStoryId(nextStory.id)}
        className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft />
        <span>{nextStory?.title}</span>
      </button>
      <button
        onClick={() => setActiveStoryId(prevStory.id)}
        className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700 justify-end"
      >
        <span>{prevStory?.title}</span>
        <ChevronRight />
      </button>
    </>
  )
}

export default function Stories({ token, roomId, className }: StoriesProps) {
  const stories = useStore((store) => store.room?.stories || [])
  const [activeStoryId, setActiveStoryId] = useState(stories[0]?.id)
  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0]

  return (
    <section className={className}>
      <div className="flex items-center w-full border-b border-gray-300 pb-4 ">
        <Navigation
          stories={stories}
          activeStory={activeStory}
          setActiveStoryId={setActiveStoryId}
        />
      </div>
      <ActiveStory story={activeStory} token={token} roomId={roomId} />
    </section>
  )
}
