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
  createdById: z.number().positive()
})

const resolver = zodResolver(schema)

type CreateStoryForm = Pick<Story, 'title' | 'description' | 'isFinished' | 'url' | 'createdById' | 'roomId'>

export default function StoryForm({ roomId, token }: RoomClientProps) {
  const socket = useSocket({ token, roomId })
  const { data: { user } } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoryForm>({ resolver, defaultValues: { url: '', description: '', isFinished: false } })
  const onSubmit: SubmitHandler<CreateStoryForm> = async (form) => {
    console.log({form})
    socket?.emit('request/createStory', form)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="title">Title</label>
      <input {...register('title')} type="text"/>

      <label htmlFor="url">URL</label>
      <input {...register('url')} type="text" />

      <label htmlFor="description">Description</label>
      <input {...register('description')} type="text" />

      <input {...register('roomId', { valueAsNumber: true })} type='hidden' value={roomId} />

      <input {...register('createdById', { valueAsNumber: true })} type='hidden' value={user.id} />

      <input type="submit" value="Create Story" />
    </form>
  )
}