import useStore from '@lib/hook/use-store'
import Image from 'next/image'

interface PlayerVotesProps extends RoomClientProps {
  votes: Vote[]
}

function Voting({
  voteOptionId,
  isLatest,
}: {
  voteOptionId: number
  isLatest: boolean
}) {
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const voting = voteOptions.find((v) => v.id === voteOptionId) as VoteOption

  return (
    <span
      className={`inline-block p-2 ${isLatest ? 'font-bold text-xl' : ''}`}
      key={voteOptionId}
    >
      {voting?.value}
    </span>
  )
}

function Vote({ vote }: { vote: Vote }) {
  const userParticipants = useStore((store) => store.getUsers())
  const { votedById } = vote
  const votedBy = userParticipants.find((p) => p.id === votedById) as User

  return (
    <tr className='border-b'>
      <td className='whitespace-nowrap px-6 py-4'>
        <div className="w-10 h-10">
          <Image
            className="rounded-full"
            src={votedBy.avatarUrl}
            width={40}
            height={40}
            alt={`${votedBy.firstName} ${votedBy.lastName}`}
          />
        </div>
      </td>
      <td className='whitespace-nowrap px-6 py-4'>
        {votedBy?.firstName} {votedBy?.lastName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right">
        {vote.votings.map(({ id, voteOptionId }, index) => (
          <Voting
            key={id}
            voteOptionId={voteOptionId}
            isLatest={index === vote.votings.length - 1}
          />
        ))}
      </td>
    </tr>
  )
}

export default function PlayerVotes({ votes }: PlayerVotesProps) {
  return (
    <>
      <table className="min-w-full text-left">
        <thead className='border-b font-medium'>
          <tr>
            <th scope='col' className='px-6 py-4'>#</th>
            <th scope='col' className='px-6 py-4'>Name</th>
            <th scope='col' className='px-6 py-4'>Vote</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote) => (
            <Vote key={vote.votedById + vote.createdAt} vote={vote} />
          ))}
        </tbody>
      </table>
    </>
  )
}
