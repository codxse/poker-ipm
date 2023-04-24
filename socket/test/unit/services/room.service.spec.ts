import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RoomService } from '@app/services/room.service'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { JoinAs, Participant } from '@app/entities/participant.entity'
import { ParticipantService } from '@app/services/participant.service'

describe('UserService', () => {
  let roomService: RoomService
  let participantService: ParticipantService

  const mockRoomRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  }

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  }

  const mockParticipantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
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
          provide: getRepositoryToken(Participant),
          useValue: mockParticipantRepository,
        },
        ParticipantService,
      ],
    }).compile()

    roomService = module.get<RoomService>(RoomService)
    participantService = module.get<ParticipantService>(ParticipantService)
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
      const roomId = 1
      const createdByUser = new User()
      createdByUser.id = userId
      const createRoomDto = {
        name: 'Room 12',
      } as CreateRoomDto

      const newRoom = {
        id: roomId,
        createdBy: createdByUser,
        ...createRoomDto,
      } as Room

      const participant = new Participant()
      participant.user = createdByUser
      participant.room = newRoom

      mockUserRepository.findOne.mockResolvedValue(createdByUser)
      mockRoomRepository.create.mockReturnValue(newRoom)
      mockRoomRepository.save.mockResolvedValue(newRoom)
      mockParticipantRepository.findOneBy.mockReturnValue(null)

      participantService.create = jest.fn().mockResolvedValue(participant)

      const result = await roomService.create(createRoomDto, userId)

      expect(result).toEqual({ ...newRoom, participants: [participant] })
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      })
      expect(mockRoomRepository.save).toHaveBeenCalledWith(newRoom)
      expect(mockRoomRepository.save).toHaveBeenCalledWith(newRoom)
      expect(participantService.create).toHaveBeenCalledWith(
        userId,
        roomId,
        JoinAs.OBSERVER,
      )
    })

    it('should create a room and add the creator as a participant when a user creates a room', async () => {
      const userId = 99
      const roomId = 1
      const joinAs = JoinAs.OBSERVER

      const createdByUser = new User()
      createdByUser.id = userId

      const createRoomDto = {
        name: 'Room 12',
      } as CreateRoomDto

      const newRoom = new Room()
      newRoom.id = roomId
      newRoom.name = createRoomDto.name
      newRoom.createdBy = createdByUser

      const participant = new Participant()
      participant.user = createdByUser
      participant.room = newRoom

      mockUserRepository.findOne.mockResolvedValue(createdByUser)
      mockRoomRepository.create.mockReturnValue(newRoom)
      mockRoomRepository.save.mockResolvedValue(newRoom)

      participantService.create = jest.fn().mockResolvedValue(participant)

      const result = await roomService.create(createRoomDto, userId)

      expect(result).toEqual({ ...newRoom, participants: [participant] })
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      })
      expect(mockRoomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: createdByUser,
          name: createRoomDto.name,
        }),
      )
      expect(mockRoomRepository.save).toHaveBeenCalledWith(newRoom)
      expect(participantService.create).toHaveBeenCalledWith(
        userId,
        roomId,
        joinAs,
      )
    })

    // it('should throw an error if createdBy user is not found', async () => {
    //   const userId = 99
    //   const createRoomDto = {
    //     name: 'Room 12',
    //   } as CreateRoomDto

    //   mockUserRepository.findOne.mockResolvedValue(null)

    //   await expect(
    //     roomService.create(createRoomDto, userId),
    //   ).rejects.toThrowError('User not found')

    //   expect(mockUserRepository.findOne).toHaveBeenCalledWith({
    //     where: { id: userId },
    //     relations: ['joins'],
    //   })
    // })
  })

  // describe('join', () => {
  //   it('should join a user to a room', async () => {
  //     const userId = 100
  //     const roomId = 5000

  //     const user = new User()
  //     user.id = userId
  //     user.joins = []

  //     const room = new Room()
  //     room.id = roomId
  //     room.users = []

  //     mockUserRepository.findOneBy.mockResolvedValue(user)
  //     mockRoomRepository.findOne.mockResolvedValue(room)

  //     await roomService.join(roomId, userId)

  //     expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
  //     expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: roomId },
  //       relations: ['users'],
  //     })
  //     expect(room.users).toContain(user)
  //     expect(mockRoomRepository.save).toHaveBeenCalledWith(room)
  //   })

  //   it('should return the existing room if the user has already joined the room', async () => {
  //     const roomId = 1
  //     const userId = 99
  //     const user = new User()
  //     user.id = userId
  //     const room = new Room()
  //     room.id = roomId
  //     room.users = [user]
  //     user.joins = [room]

  //     mockUserRepository.findOneBy.mockResolvedValue(user)
  //     mockRoomRepository.findOne.mockResolvedValue(room)

  //     const result = await roomService.join(roomId, userId)

  //     expect(result).toEqual(room)
  //     expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
  //     expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: roomId },
  //       relations: ['users'],
  //     })
  //   })

  //   it('should throw an error if room does not exist', async () => {
  //     const userId = 100
  //     const roomId = 99

  //     const user = new User()
  //     user.id = userId
  //     user.joins = []

  //     mockUserRepository.findOneBy.mockResolvedValue(user)
  //     mockRoomRepository.findOne.mockResolvedValue(undefined)

  //     await expect(roomService.join(roomId, userId)).rejects.toThrowError(
  //       `Room with id ${roomId} not found`,
  //     )

  //     expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
  //     expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: roomId },
  //       relations: ['users'],
  //     })
  //   })

  //   it('should throw an error if user does not exist', async () => {
  //     const userId = 100
  //     const roomId = 99

  //     const room = new Room()
  //     room.id = roomId

  //     mockUserRepository.findOneBy.mockResolvedValue(undefined)
  //     mockRoomRepository.findOne.mockResolvedValue(room)

  //     await expect(roomService.join(roomId, userId)).rejects.toThrowError(
  //       `User with id ${userId} not found`,
  //     )

  //     expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
  //     expect(mockRoomRepository.findOne).not.toHaveBeenCalled()
  //   })
  // })
})
