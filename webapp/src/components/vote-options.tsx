'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'

import { Trash2 } from 'lucide-react'

export default function VoteOptions({ token, roomId }: RoomClientProps) {
  const socket = useSocket({ token, roomId })
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const handleDelete = (id: VoteOption['id']) => {
    socket?.emit('request/deleteVoteOption', id)
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="text-sm text-left border-l dark:border-l-gray-700">
        <thead className="text-xs text-gray-700 dark:text-white uppercase font-semibold">
          <tr className="border-b">
            <th scope="col" className="px-6 py-4">
              Label
            </th>
            <th scope="col" className="px-6 py-4">
              Value
            </th>
            <th scope="col" className="px-6 py-4 text-right" />
          </tr>
        </thead>
        <tbody>
          {voteOptions.map(({ id, label, value }) => {
            return (
              <tr
                key={id}
                className="border-b last:border-b-0 dark:border-gray-700 "
              >
                <th
                  scope="row"
                  className="px-6 py-2 font-medium text-gray-700 dark:text-white whitespace-nowrap"
                >
                  {label}
                </th>
                <td className="px-6 py-2 text-base text-center">{value}</td>
                <td className="px-6 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
