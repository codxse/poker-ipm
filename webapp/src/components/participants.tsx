'use-client'

import useStore from '@lib/hook/use-store'
import Image from 'next/image'

export default function Participant() {
  const { getSortedParticipants } = useStore()

  return (
    <div className="hidden md:block relative overflow-x-auto rounded border border-gray-300 dark:border-gray-700 ">
      {getSortedParticipants().map(({ userId, roomId, joinAs, user }) => {
        return (
          <div
            key={`${userId}-${roomId}`}
            className="bg-white flex items-center p-4 gap-4 border-b last:border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <div className="w-10 h-10">
              <Image
                className="rounded-full max-w-none"
                src={user.avatarUrl}
                width={40}
                height={40}
                alt={`${user.firstName} ${user.lastName}`}
              />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold truncate ...">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs">{joinAs}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
