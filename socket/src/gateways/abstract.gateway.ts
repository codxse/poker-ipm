import { JwtService as JwtAuthService } from '@app/services/jwt.service'
import { OnGatewayConnection, WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

export abstract class AbstractGateway implements OnGatewayConnection {
  constructor(protected readonly jwtAuthService: JwtAuthService) {}

  async handleConnection(client: Socket): Promise<any> {
    const token = client.handshake.headers.authorization?.split(' ')[1]

    if (!token) {
      client.disconnect(true)
      throw new WsException('Authorization token not found')
    }

    try {
      const user = await this.jwtAuthService.validateToken(token)
      client.data = { user }
    } catch (error) {
      client.disconnect(true)
      throw new WsException('Invalid token')
    }
  }

  handleDisconnect(client: Socket): void {
    // TODO
    // Add any common logic for handling disconnects here
  }
}
