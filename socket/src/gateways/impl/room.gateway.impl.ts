import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  GatewayMetadata,
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
import { Participant } from '@app/entities/participant.entity'
import { corsOptions } from '@app/utils/cors'

const gatewayOptions: GatewayMetadata = {
  namespace: 'room',
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
}

@WebSocketGateway(gatewayOptions)
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

  private room(client: Socket) {
    const roomId = client.handshake.query?.roomId!
    return `room:${roomId}`
  }

  async handleConnection(client: Socket): Promise<any> {
    await super.handleConnection(client)

    const roomId = client.handshake.query?.roomId
    if (roomId) {
      const room = this.room(client)
      client.join(room)
    } else {
      client.disconnect(true)
      throw new WsException('Room ID not found')
    }
  }

  @SubscribeMessage('request/initRoom')
  async initRoom(@MessageBody() id: number) {
    const data = await this.roomService.findById(id)
    return { event: 'response/initRoom', data }
  }

  @SubscribeMessage('request/updateParticipants')
  async updateParticipants(
    @ConnectedSocket() client: Socket,
    @MessageBody() participants: Participant[],
  ) {
    const room = this.room(client)
    this.server.to(room).emit('broadcast/updateParticipants', participants)
  }

  @SubscribeMessage('request/createVoteOption')
  async createVoteOption(
    @ConnectedSocket() client: Socket,
    @MessageBody() voteOption: CreateVoteOptionDto,
  ) {
    const data = await this.voteOptionService.create(voteOption)
    const room = this.room(client)
    this.server.to(room).emit('broadcast/createVoteOption', data)
  }

  @SubscribeMessage('request/deleteVoteOption')
  async deleteVoteOption(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: number,
  ) {
    const data = await this.voteOptionService.remove(id)
    const room = this.room(client)
    this.server
      .to(room)
      .emit('broadcast/deleteVoteOption', { ...data, deleted: id })
  }

  @SubscribeMessage('findRoom')
  async roomById(@MessageBody() id: number) {
    const data = await this.roomService.findById(id)
    return {
      event: 'findRoom',
      data,
    }
  }

  @SubscribeMessage('request/createStory')
  async createStory(
    @ConnectedSocket() client: Socket,
    @MessageBody() story: CreateStoryDto,
  ) {
    const data = await this.storyService.create(story)
    const detail = await this.storyService.findOne(data.id)
    const room = this.room(client)
    this.server.to(room).emit('broadcast/createStory', detail)
  }

  @SubscribeMessage('request/deleteStory')
  async deleteStory(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: number,
  ) {
    const data = await this.storyService.remove(id)
    const room = this.room(client)
    this.server.to(room).emit('broadcast/deleteStory', { ...data, deleted: id })
  }

  @SubscribeMessage('request/updateStory')
  async finishStory(
    @ConnectedSocket() client: Socket,
    @MessageBody() story: Partial<CreateStoryDto> & { id: number },
  ) {
    const data = await this.storyService.update(story.id, story)
    const room = this.room(client)
    this.server.to(room).emit('broadcast/updateStory', data)
  }

  @SubscribeMessage('request/submitVoting')
  async submitVoting(
    @ConnectedSocket() client: Socket,
    @MessageBody() voting: SubmitVotingDto,
  ) {
    await this.voteService.upsert(voting.userId, voting.storyId)
    const data = await this.votingService.submitVoting(
      voting.userId,
      voting.storyId,
      voting.voteOptionId,
    )
    const room = this.room(client)
    this.server.to(room).emit('broadcast/submitVoting', data)
  }
}
