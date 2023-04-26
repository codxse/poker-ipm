import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService as JwtAuthService } from '@app/services/jwt.service'
import { AbstractGateway } from '@app/gateways/abstract.gateway'

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway extends AbstractGateway {
  @WebSocketServer()
  server: Server

  constructor(jwtAuthService: JwtAuthService) {
    super(jwtAuthService)
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    await super.handleConnection(client, ...args)

    const roomId = client.handshake.query?.roomId
    if (roomId) {
      client.join(roomId)
    } else {
      client.disconnect(true)
      throw new WsException('Room ID not found')
    }
  }
}
