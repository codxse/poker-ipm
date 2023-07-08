'use client'

import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(1),
})

const resolver = zodResolver(schema)

type CreateRoomForm = {
  name: string
}

export default function CreateRoom() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomForm>({ resolver })
  const onSubmit: SubmitHandler<CreateRoomForm> = (data) => {
    console.log(data)
    console.log(errors)
  }

  console.log({ errors })

  return (
    <div data-testid="room/create">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Room name</label>
        <input type="text" {...register('name')} />
        <input type="submit" value="Create Room" />
      </form>

      <Link href={'/room'}>Join a Room</Link>
    </div>
  )
}
