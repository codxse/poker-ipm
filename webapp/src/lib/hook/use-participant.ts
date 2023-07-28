import useSession from '@lib/hook/use-session'
import useStore from '@lib/hook/use-store'

export default function useParticipant(): Participant {
  const seasson = useSession()
  const participants = useStore((store) => store.room?.participants || [])

  return (
    (participants.find(
      (p) => p.userId === seasson.data.user.id,
    ) as Participant) || { joinAs: null }
  )
}

export enum JoinAsEnum {
  OBSERVER = 'observer',
  OBSERVABLE = 'observable',
}
