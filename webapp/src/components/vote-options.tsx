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
    <ul>
      {voteOptions.map(({ id, label, value }) => {
        return (
          <li key={id}>
            <p>label: {label}</p>
            <p>value: {value}</p>
            <button onClick={() => handleDelete(id)}>Delete</button>
            <hr />
          </li>
        )
      })}
    </ul>
  )
}