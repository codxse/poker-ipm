'use client'

import Link from 'next/link'
import { useMutation } from 'react-query'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import request from '@lib/request'

const OBSERVER = 'observer'
const OBSERVABLE = 'observable'

const schema = z.object({
  roomId: z.number().positive(),
  joinAs: z.enum([OBSERVER, OBSERVABLE]),
})

const resolver = zodResolver(schema)

type JoinRoomForm = {
  roomId: number
  joinAs: JoinAs
}

interface RoomsClientProps {
  token: string
}

export default function RoomsClient({ token }: RoomsClientProps) {
  const router = useRouter()
  const {
    formState: { errors },
    ...f
  } = useForm<JoinRoomForm>({ resolver, defaultValues: { joinAs: OBSERVABLE } })
  const mutation = useMutation<Room, Error, any, any>(
    async (form: JoinRoomForm) => {
      const res = await request(
        `${process.env['NEXT_PUBLIC_API_ENDPOINT']}/api/rooms/${form.roomId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        },
      )
      return (await res.json()) as Room
    },
  )
  const onSubmit: SubmitHandler<JoinRoomForm> = (form) => mutation.mutate(form)

  if (mutation.isSuccess) {
    router.replace(`rooms/${f.getValues('roomId')}`)
  }

  return (
    <div data-testid="room">
      <Link href="/rooms/create" title="create a room">
        Create a Room
      </Link>
      {mutation.isError ? <p>{mutation.error.message}</p> : null}
      <form onSubmit={f.handleSubmit(onSubmit)}>
        <label htmlFor="roomId">Room ID</label>
        <input
          {...f.register('roomId', { valueAsNumber: true })}
          type="number"
        />
        {errors.roomId ? <span>{errors.roomId.message}</span> : null}

        <input {...f.register('joinAs')} type="radio" value={OBSERVABLE} />
        <label htmlFor="joinAs">{OBSERVABLE}</label>
        <input {...f.register('joinAs')} type="radio" value={OBSERVER} />
        <label htmlFor="joinAs">{OBSERVER}</label>
        <input type="submit" value="Join Room" disabled={mutation.isLoading} />
      </form>
    </div>
  )
}
