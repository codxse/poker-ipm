import useStore from '@lib/hook/use-store'

interface PlayerVotesProps extends RoomClientProps {
  votes: Vote[]
}

function Voting({ voteOptionId }: { voteOptionId: number }) {
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const voting = voteOptions.find((v) => v.id === voteOptionId) as VoteOption

  return (
    <span className="p-2" key={voteOptionId}>
      {voting?.value}
    </span>
  )
}

function Vote({ vote }: { vote: Vote }) {
  const userParticipants = useStore((store) => store.getUsers())
  const { votedById } = vote
  const votedBy = userParticipants.find((p) => p.id === votedById) as User

  return (
    <div>
      <div>
        <p>
          Name: {votedBy?.firstName} {votedBy?.lastName}
        </p>
        <p>
          Score:{' '}
          {vote.votings.map(({ id, voteOptionId }) => (
            <Voting key={id} voteOptionId={voteOptionId} />
          ))}
        </p>
      </div>
    </div>
  )
}

export default function PlayerVotes({ votes }: PlayerVotesProps) {
  return (
    <>
      <h3>Voting Result</h3>
      {votes.map((vote) => (
        <Vote key={vote.votedById + vote.createdAt} vote={vote} />
      ))}
    </>
  )
}
