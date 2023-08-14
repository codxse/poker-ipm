'use client'

import { useEffect, useState } from 'react'
import * as io from 'socket.io-client'

let _socket: io.Socket | undefined

const useSocket = (param: {
  token: string
  roomId: string
}): io.Socket | undefined => {
  const [socket, initSocket] = useState<io.Socket | undefined>(_socket)

  useEffect(() => {
    if (!_socket) {
      _socket = io.connect(`${process.env['NEXT_PUBLIC_WS_ENDPOINT']}/room`, {
        query: {
          roomId: param.roomId,
        },
        extraHeaders: {
          Authorization: `Bearer ${param.token}`,
        },
      })

      initSocket(_socket)
      return
    }

    initSocket(_socket)
  }, [param.token, param.roomId])

  return socket
}

export type Socket = io.Socket
export default useSocket
