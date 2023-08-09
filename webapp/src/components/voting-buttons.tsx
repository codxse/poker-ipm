'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import useSession from '@lib/hook/use-session'
import sortBy from 'lodash/sortBy'

interface CreateVotingForm {
  userId: number
  storyId: number
  voteOptionId: number
}

interface VotingButtonsProps extends RoomClientProps {
  storyId: number
  disabled: boolean
  className?: string
}

export default function VotingButtons({
  token,
  roomId,
  storyId,
  disabled,
  className,
}: VotingButtonsProps) {
  const socket = useSocket({ token, roomId })
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const sortedVoteOptions = sortBy(voteOptions, ['value'])
  const {
    data: { user },
  } = useSession()

  const handleClick = (voting: CreateVotingForm) => {
    socket?.emit('request/submitVoting', voting)
  }

  return (
    <div className={className}>
      {sortedVoteOptions.map(({ id, value, label }) => (
        <button
          key={id}
          disabled={disabled}
          className="w-fit mb-2 mr-2 overflow-hidden font-medium leading-tight border-2 border-b-4 hover:border-t-4 hover:border-b-2 border-r-4 hover:border-l-4 hover:border-r-2 border-gray-700 rounded-lg"
          onClick={() =>
            handleClick({
              storyId,
              voteOptionId: id,
              userId: user.id,
            })
          }
        >
          <span className="inline-block py-3 px-5 bg-gray-600 text-white font-bold text-lg">
            {value}
          </span>
          <span className="inline-block py-3 px-5 text-gray-600">{label}</span>
        </button>
      ))}
    </div>
  )
}
