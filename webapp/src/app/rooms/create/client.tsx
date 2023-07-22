'use client'

import Link from 'next/link'
import { useMutation } from 'react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import request from '@lib/request'
import { ArrowRight } from 'lucide-react'

const schema = z.object({
  name: z.string().min(5),
})

const resolver = zodResolver(schema)

type CreateRoomForm = {
  name: string
}

type ClientProps = { token: string }

export default function RoomCreateClient({ token }: ClientProps) {
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
    <>
      <h1>Create a Room</h1>
      <section className="flex flex-col lg:w-2/6" data-testid="room/create">
        {mutation.isError ? (
          <p className="text-red-500 mb-4">{mutation.error.message}</p>
        ) : null}
        <form
          className="bg-white flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Room name
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Ruang 13"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.name ? (
              <p className="text-red-500 mt-1">{errors.name.message}</p>
            ) : null}
          </div>
          <input
            className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            value="Create new Room"
            disabled={mutation.isLoading}
          />
        </form>
      </section>
      <p className="inline-block">
        or,{' '}
        <Link
          className="font-semibold inline-flex hover:text-blue-600 mt-4"
          href={'/rooms'}
        >
          Join a Room
          <ArrowRight className="ml-2" />
        </Link>
      </p>
    </>
  )
}
