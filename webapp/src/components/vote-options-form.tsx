'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useSocket from '@lib/hook/use-socket'

import VoteOptions from '@components/vote-options'

const schema = z.object({
  label: z.string().min(1),
  value: z.number().nonnegative(),
})

const resolver = zodResolver(schema)

type CreateVoteOptionForm = Pick<VoteOption, 'label' | 'value'>

interface VoteOptionProps extends RoomClientProps {
  className?: string
}

export default function VoteOptionForm({
  token,
  roomId,
  className,
}: VoteOptionProps) {
  const socket = useSocket({ token, roomId })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVoteOptionForm>({ resolver })
  const onSubmit: SubmitHandler<CreateVoteOptionForm> = async ({
    label,
    value,
  }) => {
    socket?.emit('request/createVoteOption', { roomId, label, value })
  }

  return (
    <section className={className} data-testid="voteOption/create">
      <form
        className="flex flex-col flex-1 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="label"
          >
            Label
          </label>
          <input
            {...register('label')}
            placeholder="e.g. Eeasy"
            className="appearance-none border-b dark:bg-transparent dark:border-gray-700 border-gray-300 w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="value"
          >
            Value
          </label>
          <input
            {...register('value', { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 0"
            className="appearance-none border-b dark:bg-transparent dark:border-gray-700 border-gray-300 w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <input
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value="Create Vote Option"
        />
      </form>
      <VoteOptions token={token} roomId={roomId} />
    </section>
  )
}
