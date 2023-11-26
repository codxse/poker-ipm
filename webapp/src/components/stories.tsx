'use client'

import { useEffect, useState } from 'react'
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
import AlienAnimation from './alien-animation'

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

let interval: any

const clearance = () => {
  if (interval) clearInterval(interval)
}

function useTimer(createdAt: Date, updatedAt: Date, isFinished: boolean) {
  const [elapsed, setElapsed] = useState('')

  const secondsToTime = (elapsedSeconds: number) => {
    const dateObj = new Date(elapsedSeconds * 1000)
    const hours = dateObj.getUTCHours()
    const minutes = dateObj.getUTCMinutes()
    const seconds = dateObj.getSeconds()

    const timeString = hours.toString().padStart(2, '0') + ':' + 
        minutes.toString().padStart(2, '0') + ':' + 
        seconds.toString().padStart(2, '0')
    
    return timeString
  }

  useEffect(() => {
    if (isFinished) {
      clearance()
      const elapsed = Math.floor((updatedAt.getTime() - createdAt.getTime())/ 1000)
      setElapsed(secondsToTime(elapsed))
    } else {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - createdAt.getTime()) / 1000)
        setElapsed(secondsToTime(elapsed))
      }, 1000)
    }
  }, [isFinished, createdAt.toString(), updatedAt.toString()])


  return elapsed
}

function Timer(props: { createdAt: Date, updatedAt: Date, isFinished: boolean }) {
  const timer = useTimer(props.createdAt, props.updatedAt, props.isFinished)

  return (<p className='m-2 mr-4 text-black'>{timer}</p>)
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
  const createdAt = new Date(story.createdAt)
  const updatedAt = new Date(story.updatedAt)

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <div className="flex flex-col-reverse md:flex-col flex-1">
        <VotingButtons
          className="flex flex-wrap mt-8 md:mt-0"
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
      <div className="w-full md:w-2/5">
        {iAmObserver ? (
          <div className="hidden md:flex flex-1 justify-end">
            <Timer createdAt={createdAt} updatedAt={updatedAt} isFinished={story.isFinished}/>
            <DeleteStoryButton
              story={story}
              onDelete={() => handleDelete(story.id)}
              className="flex items-center gap-4 px-6 py-2 rounded text-white bg-red-500 hover:bg-red-600 text-sm"
            />
          </div>
        ) : null}

        <div
          className={`bg-slate-200 p-4 rounded-lg ${
            iAmObserver ? 'mt-0 md:mt-4' : 'mt-0'
          }`}
        >
          <p className="text-sm text-gray-700">
            <span className="text-gray-500">status:</span>{' '}
            <b>{story.isFinished ? 'Finished' : 'Ongoing'}</b>
          </p>
          <Title
            className="block text-4xl text-gray-900 mb-8 leading-normal border-b border-b-gray-300 pb-4"
            title={story.title}
            url={story?.url}
          />
          <ReactMarkdown className="prose prose-sm prose-slate leading-normal break-words">
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

  if (stories.length === 1) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-500 hover:text-gray-700">
        <span>{stories[0].title}</span>
      </div>
    )
  }

  const nextStory = stories[activeIndex + 1]
  if (activeIndex === 0 && stories.length > 1) {
    return (
      <>
        <button
          onClick={() => setActiveStoryId(nextStory.id)}
          className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700 text-left gap-2"
        >
          <ChevronLeft />
          <span className="hidden md:block">{nextStory?.title}</span>
          <span className="block md:hidden">Previous</span>
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
          className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700 justify-end text-right gap-2"
        >
          <span className="hidden md:block">{prevStory?.title}</span>
          <span className="block md:hidden">Next</span>
          <ChevronRight />
        </button>
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setActiveStoryId(nextStory.id)}
        className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700 text-left gap-2"
      >
        <ChevronLeft />
        <span className="hidden md:block">{nextStory?.title}</span>
        <span className="block md:hidden">Previous</span>
      </button>
      <button
        onClick={() => setActiveStoryId(prevStory.id)}
        className="flex flex-1 items-center text-sm text-gray-500 hover:text-gray-700 justify-end text-right gap-2"
      >
        <span className="hidden md:block">{prevStory?.title}</span>
        <span className="block md:hidden">Next</span>
        <ChevronRight />
      </button>
    </>
  )
}

export default function Stories({ token, roomId, className }: StoriesProps) {
  const stories = useStore((store) => store.room?.stories || [])
  const [activeStoryId, setActiveStoryId] = useState(stories[0]?.id)
  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0]

  if (stories.length === 0) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center">
          <AlienAnimation />
          <span className="block font-semibold text-gray-500 text-lg">
            No story yet...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex gap-4 border-b border-gray-300 pb-2">
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
