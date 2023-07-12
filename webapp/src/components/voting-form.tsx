'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'
import useSession from '@lib/hook/use-session'

interface CreateVotingForm {
  userId: number
  storyId: number
  voteOptionId: number
}

interface VotingFormProps extends RoomClientProps {
  storyId: number
}

export default function VotingForm({
  token,
  roomId,
  storyId,
}: VotingFormProps) {
  const socket = useSocket({ token, roomId })
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const {
    data: { user },
  } = useSession()

  const handleClick = (voting: CreateVotingForm) => {
    socket?.emit('request/submitVoting', voting)
  }

  return (
    <div>
      <h2>Voting form</h2>
      {voteOptions.map(({ id, label }) => (
        <button
          key={id}
          onClick={() =>
            handleClick({
              storyId,
              voteOptionId: id,
              userId: parseInt(user.id, 10),
            })
          }
        >
          {id} - {label}
        </button>
      ))}
    </div>
  )
}
