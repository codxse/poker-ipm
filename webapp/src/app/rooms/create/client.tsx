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

const schema = z.object({
  name: z.string().min(5),
})

const resolver = zodResolver(schema)

type CreateRoomForm = {
  name: string
}

interface CreateARoomProps {
  token: string
  className?: string
}

export default function CreateARoom({ token, className }: CreateARoomProps) {
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

  useEffect(() => {
    if (mutation.isSuccess) {
      router.replace(`/rooms/${mutation.data.id}`)
    }
  }, [mutation.isSuccess, router])

  return (
    <section className={className} data-testid="room/create">
      {mutation.isError ? (
        <p className="text-red-500 dark:text-orange-300 mb-4">
          {mutation.error.message}
        </p>
      ) : null}
      <form
        className="bg-white dark:bg-slate-800 flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full border"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="name"
          >
            Room name
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Ruang 13"
            className="appearance-none border-b dark:bg-transparent dark:border-gray-700 border-gray-300 w-full md:w-2/4 py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name ? (
            <p className="text-red-500 dark:text-orange-400 mt-1">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <input
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value={mutation.isLoading ? "Creating new room (please wait a moment)" : "Create new Room"}
          disabled={mutation.isLoading}
        />
      </form>
    </section>
  )
}
