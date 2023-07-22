'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import useSession from '@lib/hook/use-session'

interface CreateVotingForm {
  userId: number
  storyId: number
  voteOptionId: number
}

interface VotingButtonsProps extends RoomClientProps {
  storyId: number
}

export default function VotingButtons({
  token,
  roomId,
  storyId,
}: VotingButtonsProps) {
  const socket = useSocket({ token, roomId })
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const {
    data: { user },
  } = useSession()

  const handleClick = (voting: CreateVotingForm) => {
    socket?.emit('request/submitVoting', voting)
  }

  return (
    <div className="mt-8">
      {voteOptions.map(({ id, value, label }) => (
        <button
          key={id}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
          onClick={() =>
            handleClick({
              storyId,
              voteOptionId: id,
              userId: user.id,
            })
          }
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            {value} - {label}
          </span>
        </button>
      ))}
    </div>
  )
}
