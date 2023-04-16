import { Test, TestingModule } from '@nestjs/testing'
import { RoomController } from '@app/controllers/room.controller'
import { RoomService } from '@app/services/room.service'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { RequestWithUser } from '@app/interfaces/request-with-user.interface'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Room } from '@app/entities/room.entity'
import { User } from '@app/entities/user.entity'

describe('RoomController', () => {
  let roomController: RoomController
  let roomService: RoomService

  const roomRepositoryMock = {
    findOneBy: jest.fn(),
  }

  const userRepositoryMock = {
    findOneBy: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Room, User])],
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: {
            create: jest.fn(),
            join: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(getRepositoryToken(Room))
      .useValue(roomRepositoryMock)
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile()

    roomController = module.get<RoomController>(RoomController)
    roomService = module.get<RoomService>(RoomService)
  })

  it('should be defined', () => {
    expect(roomController).toBeDefined()
  })

  describe('create', () => {
    it('should call RoomService.create with the correct parameters', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Room 1',
      }

      const userId = 1

      roomService.create = jest.fn().mockResolvedValue({})

      await roomController.create(createRoomDto, {
        user: { id: userId },
      } as RequestWithUser)

      expect(roomService.create).toHaveBeenCalledWith(createRoomDto, userId)
    })
  })

  describe('join', () => {
    it('should call RoomService.join with the correct arguments', async () => {
      const roomId = 1
      const userId = 99
      const user = new User()
      const room = new Room()
      room.id = roomId
      user.id = userId
      const request = { user } as RequestWithUser

      roomService.join = jest.fn().mockResolvedValue(room)

      await roomController.join(roomId, request)

      expect(roomService.join).toHaveBeenCalledWith(roomId, userId)
    })
  })
})
