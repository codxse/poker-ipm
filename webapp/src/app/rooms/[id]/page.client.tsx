'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useSocket from '@lib/hook/use-socket'
import { useEffect, useState } from 'react'
import useStore from '@lib/hook/use-store'

interface RoomClientProps {
  roomId: string
  token: string
}

const schema = z.object({
  label: z.string().min(1),
  value: z.number().nonnegative(),
})

const resolver = zodResolver(schema)

type CreateVoteOptionForm = Pick<VoteOption, 'label' | 'value'>

function VoteOptionForm({ token, roomId }: RoomClientProps) {
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
      <input type="text" {...register('label')} />

      <label htmlFor="value">Value</label>
      <input type="number" {...register('value', { valueAsNumber: true })} />

      <input type="submit" value="Create Vote Option" />
    </form>
  )
}

function VoteOptions({ token, roomId }: RoomClientProps) {
  const socket = useSocket({ token, roomId })
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const handleDelete = (id: VoteOption['id']) => {
    socket?.emit('request/deleteVoteOption', id)
  }

  return (
    <ul>
      {voteOptions.map(({ id, label, value }) => {
        return (
          <li key={id}>
            <p>label: {label}</p>
            <p>value: {value}</p>
            <button onClick={() => handleDelete(id)}>Delete</button>
            <hr />
          </li>
        )
      })}
    </ul>
  )
}

export default function RoomClient(props: RoomClientProps) {
  const socket = useSocket({ token: props.token, roomId: props.roomId })
  const { room, ...store } = useStore((store) => store)

  useEffect(() => {
    if (!socket) return

    socket.emit('request/initRoom', parseInt(props.roomId, 10))

    socket.on('response/initRoom', store.initRoom)
    socket.on('broadcast/deleteVoteOption', ({ deleted }) =>
      store.removeVoteOptionById(deleted),
    )
    socket.on('broadcast/createVoteOption', store.appendVoteOptions)

    return function () {
      socket.disconnect()
    }
  }, [socket])

  return (
    <div>
      <VoteOptionForm {...props} />
      <VoteOptions {...props} />
      <pre>{JSON.stringify(room, null, 2)}</pre>
    </div>
  )
}
