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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="label">Label</label>
      <input {...register('label')} type="text" />

      <label htmlFor="value">Value</label>
      <input {...register('value', { valueAsNumber: true })} type="number" />

      <input type="submit" value="Create Vote Option" />
    </form>
  )
}