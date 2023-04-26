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
      const token = client.handshake.query?.token as string

      if (!token) {
        throw new Error('No token provided')
      }

      const user = this.jwtStrategy.verify(token, process.env.JWT_SECRET)

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
