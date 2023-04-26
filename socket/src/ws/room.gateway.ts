import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService as JwtStrategy } from '@app/services/jwt.service'

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1]

      if (!token) {
        throw new Error('No token provided')
      }

      const user = await this.jwtStrategy.validateToken(token)

      client.data = { user }
    } catch (error) {
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket) {
    // TODO
  }

  @SubscribeMessage('vote')
  async handleVote(client: Socket, payload: any) {
    // TODO
  }
}
