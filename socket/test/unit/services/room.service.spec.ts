import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomService } from '@app/services/room.service'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { JoinAs, Participant } from '@app/entities/participant.entity'
import { ParticipantService } from '@app/services/participant.service'
import { DataSource, EntityManager, QueryRunner } from 'typeorm'

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

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),
  } as unknown as QueryRunner

  const mockDataSource: Partial<DataSource> = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  }

  const mockEntityManager = new EntityManager(mockDataSource as any)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Room, User, Participant])],
      providers: [
        RoomService,
        ParticipantService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(Room))
      .useValue(mockRoomRepository)
      .overrideProvider(getRepositoryToken(Participant))
      .useValue(mockParticipantRepository)
      .compile()

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

      const newRoom = new Room()
      newRoom.id = roomId
      newRoom.createdBy = createdByUser
      newRoom.name = createRoomDto.name

      const participant = new Participant()
      participant.userId = userId
      participant.roomId = roomId
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

    it('should throw an error if createdBy user is not found', async () => {
      const userId = 99
      const createRoomDto = {
        name: 'Room 12',
      } as CreateRoomDto

      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(
        roomService.create(createRoomDto, userId),
      ).rejects.toThrowError('User not found')

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      })
    })
  })

  describe('join', () => {
    it('should join a user to a room', async () => {
      const roomId = 1
      const userId = 1
      const joinAs = JoinAs.OBSERVER

      const mockUser = new User()
      mockUser.id = userId
      mockUser.firstName = 'John'
      mockUser.lastName = 'Doe'

      const mockRoom = new Room()
      mockRoom.id = roomId
      mockRoom.name = 'Test Room'
      mockRoom.participants = []

      const mockParticipant = new Participant()
      mockParticipant.userId = userId
      mockParticipant.roomId = roomId
      mockParticipant.joinAs = joinAs
      mockParticipant.save = jest.fn()

      mockUserRepository.findOneBy.mockResolvedValueOnce(mockUser)
      mockRoomRepository.findOne.mockResolvedValueOnce(mockRoom)

      participantService.create = jest
        .fn()
        .mockResolvedValueOnce(mockParticipant)
      mockParticipantRepository.save.mockResolvedValueOnce(mockParticipant)

      const result = await roomService.join(roomId, userId, joinAs)

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: roomId,
        },
        relations: {
          participants: true,
        },
      })
      expect(participantService.create).toHaveBeenCalledWith(
        userId,
        roomId,
        joinAs,
      )
      expect(mockParticipant.save).toHaveBeenCalled()
      expect(result).toEqual(mockParticipant)
    })

    it('should return the existing participant if the user has already joined the room', async () => {
      const roomId = 1
      const userId = 1
      const joinAs = JoinAs.OBSERVER

      const mockUser = new User()
      mockUser.id = userId
      mockUser.firstName = 'John'
      mockUser.lastName = 'Doe'

      const mockRoom = new Room()
      mockRoom.id = roomId
      mockRoom.name = 'Test Room'

      const mockParticipant = new Participant()
      mockParticipant.userId = userId
      mockParticipant.roomId = roomId
      mockParticipant.joinAs = joinAs

      mockRoom.participants = [mockParticipant]

      mockUserRepository.findOneBy.mockResolvedValueOnce(mockUser)
      mockRoomRepository.findOne.mockResolvedValueOnce(mockRoom)

      const result = await roomService.join(roomId, userId, joinAs)

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: roomId,
        },
        relations: {
          participants: true,
        },
      })

      expect(mockParticipantRepository.create).not.toHaveBeenCalled()
      expect(mockParticipantRepository.save).not.toHaveBeenCalled()

      expect(result).toEqual(mockParticipant)
    })

    it('should throw an error if room does not exist', async () => {
      const userId = 100
      const roomId = 99

      const user = new User()
      user.id = userId

      mockUserRepository.findOneBy.mockResolvedValue(user)
      mockRoomRepository.findOne.mockResolvedValue(undefined)

      await expect(roomService.join(roomId, userId)).rejects.toThrowError(
        `Room with id ${roomId} not found`,
      )

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: {
          participants: true,
        },
      })
    })

    it('should throw an error if user does not exist', async () => {
      const userId = 100
      const roomId = 99

      const room = new Room()
      room.id = roomId

      mockUserRepository.findOneBy.mockResolvedValue(undefined)
      mockRoomRepository.findOne.mockResolvedValue(room)

      await expect(roomService.join(roomId, userId)).rejects.toThrowError(
        `User with id ${userId} not found`,
      )

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).not.toHaveBeenCalled()
    })
  })

  describe('leave', () => {
    it('should remove a user from a room', async () => {
      const roomId = 1
      const creatorId = 200
      const userId = 1

      const mockCreator = new User()
      mockCreator.id = creatorId

      const mockUser = new User()
      mockUser.id = userId

      const mockRoom = new Room()
      mockRoom.id = roomId
      mockRoom.createdBy = mockCreator

      const mockParticipant = new Participant()
      mockParticipant.userId = userId
      mockParticipant.roomId = roomId

      mockUserRepository.findOneBy.mockResolvedValue(mockUser)
      mockRoomRepository.findOne.mockResolvedValue(mockRoom)
      participantService.findById = jest.fn().mockResolvedValue(mockParticipant)
      participantService.remove = jest.fn().mockResolvedValue(null)

      await roomService.leave(roomId, userId)

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: { createdBy: true },
      })
      expect(participantService.findById).toHaveBeenCalledWith(userId, roomId)
      expect(participantService.remove).toHaveBeenCalledWith(mockParticipant)
    })

    it('should throw a NotFoundException if the user does not exist', async () => {
      const roomId = 1
      const userId = 1

      mockUserRepository.findOneBy.mockResolvedValue(undefined)

      await expect(roomService.leave(roomId, userId)).rejects.toThrow(
        NotFoundException,
      )
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
    })

    it('should throw a NotFoundException if the room does not exist', async () => {
      const roomId = 1
      const userId = 1

      const mockUser = new User()
      mockUser.id = userId

      mockUserRepository.findOneBy.mockResolvedValue(mockUser)
      mockRoomRepository.findOne.mockResolvedValue(undefined)

      await expect(roomService.leave(roomId, userId)).rejects.toThrow(
        NotFoundException,
      )
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: { createdBy: true },
      })
    })

    it('should throw a NotFoundException if the participant does not exist', async () => {
      const roomId = 1
      const userId = 1
      const creatorId = 2

      const mockUser = new User()
      mockUser.id = userId

      const mockCreator = new User()
      mockCreator.id = creatorId

      const mockRoom = new Room()
      mockRoom.id = roomId
      mockRoom.createdBy = mockCreator

      mockUserRepository.findOneBy.mockResolvedValue(mockUser)
      mockRoomRepository.findOne.mockResolvedValue(mockRoom)
      participantService.findById = jest.fn().mockResolvedValue(undefined)

      await expect(roomService.leave(roomId, userId)).rejects.toThrow(
        NotFoundException,
      )
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: { createdBy: true },
      })
      expect(participantService.findById).toHaveBeenCalledWith(userId, roomId)
    })

    it('should throw a BadRequestException if the room creator tries to leave the room', async () => {
      const roomId = 1
      const userId = 1

      const mockUser = new User()
      mockUser.id = userId

      const mockRoom = new Room()
      mockRoom.id = roomId
      mockRoom.createdBy = mockUser

      mockUserRepository.findOneBy.mockResolvedValue(mockUser)
      mockRoomRepository.findOne.mockResolvedValue(mockRoom)

      await expect(roomService.leave(roomId, userId)).rejects.toThrow(
        BadRequestException,
      )
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId })
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: { createdBy: true },
      })
    })
  })

  describe('findById', () => {
    it('should return a room by id', async () => {
      const roomId = 1
      const room = {
        id: roomId,
        name: 'Test Room',
      } as Room

      mockRoomRepository.findOne.mockResolvedValue(room)
      const result = await roomService.findById(roomId)

      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: {
          createdBy: true,
          participants: true,
          stories: true,
          voteOptions: true,
        },
      })
      expect(result).toEqual(room)
    })

    it('should throw a NotFoundException if the room is not found', async () => {
      const roomId = 1
      mockRoomRepository.findOne.mockResolvedValue(undefined)

      await expect(roomService.findById(roomId)).rejects.toThrow(
        NotFoundException,
      )
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
        relations: {
          createdBy: true,
          participants: true,
          stories: true,
          voteOptions: true,
        },
      })
    })
  })
})
