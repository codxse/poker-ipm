import { Test, TestingModule } from '@nestjs/testing'
import { getDataSourceToken } from '@nestjs/typeorm'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RoomService } from '@app/services/room.service'
import { CreateRoomDto } from '@app/dto/create-room.dto'

describe('UserService', () => {
  let roomService: RoomService

  const mockRoomRepository = {
    create: jest.fn(),
    save: jest.fn(),
  }

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  }

  const mockUserRoomsRepository = {}

  const mockConnection = {
    getRepository: jest.fn().mockReturnValue(mockUserRoomsRepository),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(Room),
          useValue: mockRoomRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getDataSourceToken(),
          useValue: mockConnection,
        },
      ],
    }).compile()

    roomService = module.get<RoomService>(RoomService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(RoomService).toBeDefined()
  })

  describe('create', () => {
    it('should create a new room', async () => {
      const userId = 99
      const createdByUser = new User()
      createdByUser.id = userId
      const createRoomDto = {
        name: 'Room 12',
      } as CreateRoomDto

      const newRoom = {
        id: 1,
        createdBy: createdByUser,
        ...createRoomDto,
      } as Room

      mockUserRepository.findOneBy.mockResolvedValue(createdByUser)
      mockRoomRepository.create.mockReturnValue(newRoom)
      mockRoomRepository.save.mockResolvedValue(newRoom)

      const result = await roomService.create(createRoomDto, userId)

      expect(result).toEqual(newRoom)
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      })
      expect(mockRoomRepository.save).toHaveBeenCalledWith(newRoom)
    })
  })
})
