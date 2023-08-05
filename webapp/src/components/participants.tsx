'use-client'

import useStore from '@lib/hook/use-store'
import Image from 'next/image'

export default function Participant() {
  const { getSortedParticipants } = useStore()

  return (
    <div className="relative overflow-x-auto shadow-md rounded">
      {getSortedParticipants().map(({ userId, roomId, joinAs, user }) => {
        return (
          <div
            key={`${userId}-${roomId}`}
            className="bg-white flex items-center p-4 gap-4 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <div className="w-10 h-10">
              <Image
                className="rounded-full"
                src={user.avatarUrl}
                width={40}
                height={40}
                alt={`${user.firstName} ${user.lastName}`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
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
