'use client'

import { useMutation } from 'react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import request from '@lib/request'
import { useEffect } from 'react'
import { JoinAsEnum } from '@lib/hook/use-participant'
import { roleAs } from '@lib/utils'

const OBSERVER = JoinAsEnum.OBSERVER
const OBSERVABLE = JoinAsEnum.OBSERVABLE

const schema = z.object({
  roomId: z.number().positive(),
  joinAs: z.enum([OBSERVER, OBSERVABLE]),
})

const resolver = zodResolver(schema)

type JoinRoomForm = {
  roomId: number
  joinAs: JoinAs
}

interface JoinARoomProps {
  token: string
  id?: number
  className?: string
}

export default function JoinARoom({ token, id, className }: JoinARoomProps) {
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
      router.replace(`/rooms/${f.getValues('roomId')}`)
    }
  }, [mutation.isSuccess, router])

  return (
    <section className={className} data-testid="room">
      {mutation.isError ? (
        <p className="text-red-500 dark:text-orange-300 mb-4">
          {mutation.error.message}
        </p>
      ) : null}
      <form
        className="bg-white dark:bg-slate-800 flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full border"
        onSubmit={f.handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="roomId"
          >
            Room ID
          </label>
          <input
            {...f.register('roomId', { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 1333"
            className="appearance-none border-b dark:bg-transparent dark:border-gray-700 border-gray-300 w-full md:w-2/4 py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.roomId ? (
            <p className="text-red-500 dark:text-orange-400 mt-1">
              {errors.roomId.message}
            </p>
          ) : null}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
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
              {roleAs(OBSERVABLE)}
            </label>
            <input
              {...f.register('joinAs')}
              className="mr-2"
              type="radio"
              value={OBSERVER}
            />
            <label htmlFor="joinAs">{roleAs(OBSERVER)}</label>
          </div>
        </div>

        <input
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value={mutation.isLoading ? "Joining (please wait a moment)" : "Join Room"}
          disabled={mutation.isLoading}
        />
      </form>
    </section>
  )
}
