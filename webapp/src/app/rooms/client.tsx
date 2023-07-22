'use client'

import Link from 'next/link'
import { useMutation } from 'react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import request from '@lib/request'
import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'

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

interface Props {
  token: string
  id?: number
}

export default function RoomsClient({ token, id }: Props) {
  const router = useRouter()
  const {
    formState: { errors },
    ...f
  } = useForm<JoinRoomForm>({
    resolver,
    defaultValues: { joinAs: OBSERVABLE, roomId: id },
  })
  const mutation = useMutation<Participant, Error, any, any>(
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
      return (await res.json()) as Participant
    },
  )
  const onSubmit: SubmitHandler<JoinRoomForm> = (form) => mutation.mutate(form)

  useEffect(() => {
    if (mutation.isSuccess) {
      router.replace(`rooms/${f.getValues('roomId')}`)
    }
  }, [mutation.isSuccess])

  return (
    <>
      <h1>Join a Room</h1>
      <section className="flex flex-col lg:w-2/6" data-testid="room">
        {mutation.isError ? (
          <p className="text-red-500 mb-4">{mutation.error.message}</p>
        ) : null}
        <form
          className="bg-white flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={f.handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="roomId"
            >
              Room ID
            </label>
            <input
              {...f.register('roomId', { valueAsNumber: true })}
              type="number"
              placeholder="13"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.roomId ? (
              <p className="text-red-500 mt-1">{errors.roomId.message}</p>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Join as
            </label>
            <div className="flex items-center">
              <input
                {...f.register('joinAs')}
                className="mr-2"
                type="radio"
                value={OBSERVABLE}
              />
              <label htmlFor="joinAs" className="mr-8">
                {OBSERVABLE}
              </label>
              <input
                {...f.register('joinAs')}
                className="mr-2"
                type="radio"
                value={OBSERVER}
              />
              <label htmlFor="joinAs">{OBSERVER}</label>
            </div>
          </div>

          <input
            className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            value="Join Room"
            disabled={mutation.isLoading}
          />
        </form>
      </section>
      <p className="inline-block">
        Or,{' '}
        <Link
          className="font-semibold inline-flex hover:text-blue-600 mt-4"
          href="/rooms/create"
          title="create a room"
        >
          Create a Room
          <ArrowRight className="ml-2" />
        </Link>
      </p>
    </>
  )
}
