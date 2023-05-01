import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService as JwtAuthService } from '@app/services/jwt.service'
import { AbstractGateway } from '@app/gateways/abstract.gateway'
import { RoomService } from '@app/services/room.service'
import { StoryService } from '@app/services/story.service'
import { VoteOptionService } from '@app/services/vote-option.service'
import { VoteService } from '@app/services/vote.service'
import { VotingService } from '@app/services/voting.service'
import { ParticipantService } from '@app/services/participant.service'

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway extends AbstractGateway {
  @WebSocketServer()
  server: Server

  constructor(
    jwtAuthService: JwtAuthService,
    private readonly roomService: RoomService,
    private readonly storyService: StoryService,
    private readonly voteOptionService: VoteOptionService,
    private readonly voteService: VoteService,
    private readonly votingService: VotingService,
    private readonly participantService: ParticipantService,
  ) {
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
