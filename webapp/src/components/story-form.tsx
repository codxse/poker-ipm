'use-client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useSocket from '@lib/hook/use-socket'
import useSession from '@lib/hook/use-session'

const schema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional().or(z.literal('')),
  description: z.string(),
  isFinished: z.boolean(),
  roomId: z.number().positive(),
  createdById: z.number().positive(),
})

const resolver = zodResolver(schema)

type CreateStoryForm = Pick<
  Story,
  'title' | 'description' | 'isFinished' | 'url' | 'createdById' | 'roomId'
>

interface StoryFormProps extends RoomClientProps {
  className?: string
}

export default function StoryForm({
  roomId,
  token,
  className,
}: StoryFormProps) {
  const socket = useSocket({ token, roomId })
  const {
    data: { user },
  } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoryForm>({
    resolver,
    defaultValues: { url: '', description: '', isFinished: false },
  })
  const onSubmit: SubmitHandler<CreateStoryForm> = async (form) => {
    socket?.emit('request/createStory', form)
  }

  return (
    <section className={className} data-testid="story/create">
      <form
        className="flex flex-col shadow-md flex-1 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g. Config max capping wallet "
            className="appearance-none border-b dark:bg-transparent dark:border-gray-700 border-gray-300 w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="url"
          >
            URL
          </label>
          <input
            {...register('url')}
            type="text"
            placeholder="e.g. https://www.pivotaltracker.com/story/show/184444472"
            className="appearance-none border-b dark:bg-transparent dark:border-gray-700 border-gray-300 w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="block shadow py-2 px-3 w-full border rounded dark:bg-transparent dark:border-gray-700 border-gray-300 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Write your description here..."
          />
        </div>

        <input
          {...register('roomId', { valueAsNumber: true })}
          type="hidden"
          value={roomId}
        />

        <input
          {...register('createdById', { valueAsNumber: true })}
          type="hidden"
          value={user.id}
        />

        <input
          type="submit"
          value="Create Story"
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        />
      </form>
    </section>
  )
}
