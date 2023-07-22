'use-client'

import useStore from '@lib/hook/use-store'
import Image from 'next/image'

export default function Participant() {
  const participants = useStore((store) => store.room?.participants || [])

  return (
    <div className="relative overflow-x-auto shadow-md rounded">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-2"></th>
            <th scope="col" className="px-6 py-2">
              Name
            </th>
            <th scope="col" className="px-6 py-2">
              Join as
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map(({ userId, roomId, joinAs, user }) => {
            return (
              <tr
                key={`${userId}-${roomId}`}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Image
                    src={user.avatarUrl}
                    width={40}
                    height={40}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                </th>
                <td className="px-6 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-2">{joinAs}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
