'use client'

import Link from 'next/link'
import { useMutation } from 'react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import request from '@lib/request'

const schema = z.object({
  name: z.string().min(5),
})

const resolver = zodResolver(schema)

type CreateRoomForm = {
  name: string
}

type RoomsCreateClientProps = { token: string }

export default function RoomsCreateClient({ token }: RoomsCreateClientProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomForm>({ resolver })
  const mutation = useMutation<Room, Error, any, any>(
    async (form: CreateRoomForm) => {
      const res = await request(
        `${process.env['NEXT_PUBLIC_API_ENDPOINT']}/api/rooms`,
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

  const onSubmit: SubmitHandler<CreateRoomForm> = (form) =>
    mutation.mutate(form)

  if (mutation.isSuccess) {
    router.replace(`rooms/${mutation.data.id}`)
  }

  return (
    <div data-testid="room/create">
      {mutation.isError ? <span>{mutation.error.message}</span> : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Room name</label>
        <input type="text" {...register('name')} />
        {errors.name ? <span>{errors.name.message}</span> : null}
        <input
          type="submit"
          value="Create new Room"
          disabled={mutation.isLoading}
        />
      </form>

      <Link href={'/rooms'}>Join a Room</Link>
    </div>
  )
}
