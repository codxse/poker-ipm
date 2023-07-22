'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useSocket from '@lib/hook/use-socket'

const schema = z.object({
  label: z.string().min(1),
  value: z.number().nonnegative(),
})

const resolver = zodResolver(schema)

type CreateVoteOptionForm = Pick<VoteOption, 'label' | 'value'>

export default function VoteOptionForm({ token, roomId }: RoomClientProps) {
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
    <section className="flex flex-col lg:w-2/6" data-testid="voteOption/create">
      <form
        className="bg-white flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="label"
          >
            Label
          </label>
          <input
            {...register('label')}
            placeholder="Eeasy"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="value"
          >
            Value
          </label>
          <input
            {...register('value', { valueAsNumber: true })}
            type="number"
            placeholder="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <input
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value="Create Vote Option"
        />
      </form>
    </section>
  )
}
