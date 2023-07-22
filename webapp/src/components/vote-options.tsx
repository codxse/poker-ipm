'use client'

import useSocket from '@lib/hook/use-socket'
import useStore from '@lib/hook/use-store'

export default function VoteOptions({ token, roomId }: RoomClientProps) {
  const socket = useSocket({ token, roomId })
  const voteOptions = useStore((store) => store.room?.voteOptions || [])
  const handleDelete = (id: VoteOption['id']) => {
    socket?.emit('request/deleteVoteOption', id)
  }

  return (
    <div className="relative overflow-x-auto shadow-md rounded">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-2">
              Label
            </th>
            <th scope="col" className="px-6 py-2">
              Value
            </th>
            <th scope="col" className="px-6 py-2 text-right" />
          </tr>
        </thead>
        <tbody>
          {voteOptions.map(({ id, label, value }) => {
            return (
              <tr
                key={id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {label}
                </th>
                <td className="px-6 py-2">{value}</td>
                <td className="px-6 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="shadow appearance-none border focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-700"
                  >
                    DELETE!
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
