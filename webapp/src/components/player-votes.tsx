import useStore from '@lib/hook/use-store'
import Image from 'next/image'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import useParticipant, { JoinAsEnum } from '@lib/hook/use-participant'
import takeRight from 'lodash/takeRight'
import last from 'lodash/last'

interface PlayerVotesProps extends RoomClientProps {
  votes: Vote[]
  onFinish(): void
  isFinished: boolean
}

function Voting({
  voteOptionId,
  isLatest,
  isFinished,
}: {
  voteOptionId: number
  isLatest: boolean
  isFinished: boolean
}) {
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const voting = voteOptions.find((v) => v.id === voteOptionId) as VoteOption

  return (
    <span
      className={`inline-block p-2 ${isLatest ? 'font-bold text-xl' : ''}`}
      key={voteOptionId}
    >
      {isFinished ? voting?.value : '?'}
    </span>
  )
}

function Vote({ vote, isFinished }: { vote: Vote; isFinished: boolean }) {
  const userParticipants = useStore((store) => store.getUsers())
  const { votedById } = vote
  const votedBy = userParticipants.find((p) => p.id === votedById) as User
  const lastVoting = last(vote.votings)

  return (
    <tr className="border-b border-b-gray-200">
      <td className="whitespace-nowrap px-2 md:px-6 py-1 md:py-2 ">
        <div className="w-8 md:w-10 h-8 md:h-10">
          <Image
            className="rounded-full"
            src={votedBy?.avatarUrl || 'https://i.pravatar.cc/100'}
            width={40}
            height={40}
            alt={`${votedBy?.firstName || 'Hacker..?'} ${votedBy?.lastName}`}
          />
        </div>
      </td>
      <td className="whitespace-nowrap px-2 md:px-6 py-1 md:py-2 text-sm md:text-md text-slate-600">
        {votedBy?.firstName} {votedBy?.lastName}
      </td>
      <td
        className={`whitespace-nowrap px-2 md:px-6 py-1 md:py-2 text-black text-right ${
          isFinished ? '' : 'blur'
        }`}
      >
        {takeRight(vote.votings, 5).map(({ id, voteOptionId }) => (
          <Voting
            key={id}
            isFinished={isFinished}
            voteOptionId={voteOptionId}
            isLatest={lastVoting.id === id}
          />
        ))}
      </td>
    </tr>
  )
}

interface FinishStoryButtonProps {
  isFinished: boolean
  handleFinish(): void
}

function FinishStoryButton({
  isFinished,
  handleFinish,
}: FinishStoryButtonProps) {
  return (
    <button
      className="flex-none flex items-center justify-center w-9 h-9 rounded-md text-slate-500 border hover:text-slate-700 border-slate-200"
      type="button"
      aria-label="Show"
      onClick={() => handleFinish()}
    >
      {isFinished ? <EyeIcon /> : <EyeOffIcon />}
    </button>
  )
}

export default function PlayerVotes({
  votes,
  onFinish,
  isFinished,
}: PlayerVotesProps) {
  const iAm = useParticipant()
  const iAmObserver = iAm.joinAs === JoinAsEnum.OBSERVER
  return (
    <>
      <table className="w-full md:w-4/5 text-left mt-8">
        <thead className="border-b border-b-gray-200 font-medium">
          <tr>
            <th scope="col" className="px-2 md:px-6 py-1 md:py-2 w-20" />
            <th
              scope="col"
              className="px-2 md:px-6 py-1 md:py-2 text-slate-600 text-sm uppercase w-80"
            >
              Players
            </th>
            <th
              scope="col"
              className="px-2 md:px-6 py-1 md:py-2 text-slate-600 text-center flex justify-end w-full"
            >
              {iAmObserver ? (
                <FinishStoryButton
                  handleFinish={onFinish}
                  isFinished={isFinished}
                />
              ) : null}
            </th>
          </tr>
        </thead>
        <tbody className="&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:bg-gray-200">
          {votes.map((vote) => (
            <Vote
              key={vote.votedById + vote.createdAt}
              vote={vote}
              isFinished={isFinished}
            />
          ))}
        </tbody>
      </table>
    </>
  )
}
