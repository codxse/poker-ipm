'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import useSession from '@lib/hook/use-session'
import sortBy from 'lodash/sortBy'
import debounce from 'lodash/debounce'

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

  const handleClick = debounce((voting: CreateVotingForm) => {
    socket?.emit('request/submitVoting', voting)
  }, 500)

  return (
    <div className={className}>
      {sortedVoteOptions.map(({ id, value, label }) => (
        <button
          key={id}
          disabled={disabled}
          className={`w-fit mb-2 mr-2 overflow-hidden cursor-pointer font-medium leading-tight border-2 border-b-4 rounded-lg
                     ${
                       disabled
                         ? 'border-gray-400 bg-gray-200 border-r-4'
                         : 'border-gray-700 hover:bg-slate-200 active:border-t-4 active:border-b-2 border-r-4 active:border-l-4 active:border-r-2'
                     }`}
          onClick={() =>
            handleClick({
              storyId,
              voteOptionId: id,
              userId: user.id,
            })
          }
        >
          <span
            className={`inline-block py-3 px-5 font-bold text-lg ${
              disabled ? 'bg-gray-400 text-gray-500' : 'bg-gray-600 text-white'
            } `}
          >
            {value}
          </span>
          <span
            className={`inline-block py-3 px-5 ${
              disabled ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
