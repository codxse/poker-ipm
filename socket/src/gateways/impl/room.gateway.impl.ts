import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
  SubscribeMessage,
  MessageBody,
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
import { CreateVoteOptionDto } from '@app/dto/create-vote-option.dto'
import { CreateStoryDto } from '@app/dto/create-story.dto'
import { SubmitVotingDto } from '@app/dto/submit-voting-dto'

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

  async handleConnection(client: Socket): Promise<any> {
    await super.handleConnection(client)

    const roomId = client.handshake.query?.roomId
    if (roomId) {
      const room = `room:${roomId}`
      client.join(room)
    } else {
      client.disconnect(true)
      throw new WsException('Room ID not found')
    }
  }

  @SubscribeMessage('createVoteOption')
  async createVoteOption(@MessageBody() voteOption: CreateVoteOptionDto) {
    const data = await this.voteOptionService.create(voteOption)
    return {
      event: 'createVoteOption',
      data,
    }
  }

  @SubscribeMessage('findRoom')
  async roomById(@MessageBody() id: number) {
    const data = await this.roomService.findById(id)
    return {
      event: 'findRoom',
      data,
    }
  }

  @SubscribeMessage('createStory')
  async createStory(@MessageBody() story: CreateStoryDto) {
    const data = await this.storyService.create(story)
    return {
      event: 'createStory',
      data,
    }
  }

  @SubscribeMessage('submitVoting')
  async submitVoting(@MessageBody() voting: SubmitVotingDto) {
    await this.voteService.upsert(voting.userId, voting.storyId)
    const data = await this.votingService.submitVoting(
      voting.userId,
      voting.storyId,
      voting.voteOptionId,
    )

    return {
      event: 'submitVoting',
      data,
    }
  }
}
