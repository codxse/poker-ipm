'use client'

import { useState } from 'react'
import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import findLastIndex from 'lodash/findLastIndex'
import findIndex from 'lodash/findIndex'
import ReactMarkdown from 'react-markdown'
import VotingButtons from '@components/voting-buttons'
import PlayerVotes from '@components/player-votes'
import useParticipant, { JoinAsEnum } from '@lib/hook/use-participant'
import debounce from 'lodash/debounce'
import { ChevronLeft, ChevronRight, Trash2Icon } from 'lucide-react'

function Title({ title, url, className }) {
  if (url) {
    return (
      <a href={url} title={title} target="_blank">
        <h2 className={className}>{title}</h2>
      </a>
    )
  }

  return <h2 className={className}>{title}</h2>
}

interface DeleteStoryButtonProps {
  story: Story
  onDelete(): void
  className?: string
}

function DeleteStoryButton({
  onDelete,
  story,
  className,
}: DeleteStoryButtonProps) {
  return (
    <button className={className} onClick={onDelete}>
      <i>
        <Trash2Icon />
      </i>
      Delete Story #{story.id}
    </button>
  )
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

  const finishStory = debounce((storyId: Story['id']) => {
    socket?.emit('request/updateStory', {
      id: storyId,
      isFinished: !story.isFinished,
    })
  }, 100)

  const { story } = props
  return (
    <div className="w-full flex gap-4">
      <div className="flex flex-col flex-1">
        <VotingButtons
          className="flex flex-wrap"
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
          onFinish={() => finishStory(story.id)}
          isFinished={story.isFinished}
        />
      </div>
      <div className="w-2/5 ">
        {iAmObserver ? (
          <div className="flex flex-1 justify-end">
            <DeleteStoryButton
              story={story}
              onDelete={() => handleDelete(story.id)}
              className="flex items-center gap-4 px-6 py-2 rounded text-white bg-red-500 hover:bg-red-600 text-sm"
            />
          </div>
        ) : null}

        <div className="bg-slate-200 p-4 rounded-lg mt-4">
          <p className="text-sm text-gray-700">
            <span className="text-gray-500">status:</span>{' '}
            <b>{story.isFinished ? 'Finished' : 'Ongoing'}</b>
          </p>
          <Title
            className="block text-4xl text-gray-900 mb-8 leading-normal border-b border-b-gray-300 pb-4"
            title={story.title}
            url={story?.url}
          />
          <ReactMarkdown className="prose prose-sm prose-slate leading-normal">
            {story.description}
          </ReactMarkdown>
        </div>
      </div>
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
    <div className={className}>
      <div className="flex items-center border-b border-gray-300 pb-4 ">
        <Navigation
          stories={stories}
          activeStory={activeStory}
          setActiveStoryId={setActiveStoryId}
        />
      </div>
      <ActiveStory story={activeStory} token={token} roomId={roomId} />
    </div>
  )
}
