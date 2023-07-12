import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { StoryService } from '@app/services/story.service'
import { Story } from '@app/entities/story.entity'
import { CreateStoryDto } from '@app/dto/create-story.dto'
import { User } from '@app/entities/user.entity'
import { Room } from '@app/entities/room.entity'

describe('StoryService', () => {
  let service: StoryService
  let repository: Repository<Story>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        {
          provide: getRepositoryToken(Story),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<StoryService>(StoryService)
    repository = module.get<Repository<Story>>(getRepositoryToken(Story))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  describe('create', () => {
    it('should create a new story', async () => {
      const user = new User()
      const room = new Room()
      user.id = 100
      room.id = 99

      const createStoryDto: CreateStoryDto = {
        title: 'Test Story',
        url: 'https://example.com',
        description: 'This is a test story',
        isFinished: false,
        createdById: user.id,
        roomId: room.id,
      }

      const expectedStory = {
        id: 1,
        createdBy: user,
        createdById: user.id,
        roomId: room.id,
        room: room,
        votes: [],
        ...createStoryDto,
      } as Story

      jest.spyOn(repository, 'create').mockReturnValue(expectedStory)
      jest.spyOn(repository, 'save').mockResolvedValue(expectedStory)

      const result = await service.create(createStoryDto)
      expect(repository.create).toBeCalledWith(createStoryDto)
      expect(repository.save).toBeCalledWith(expectedStory)

      expect(result).toEqual(expectedStory)
    })
  })

  describe('findOne', () => {
    it('should find a story by id', async () => {
      const expectedStory = {
        id: 1,
        title: 'Test Story',
        url: 'https://example.com',
        description: 'This is a test story',
        isFinished: false,
      } as Story

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedStory)

      const result = await service.findOne(1)
      expect(repository.findOne).toBeCalledWith({ where: { id: 1 } })
      expect(result).toEqual(expectedStory)
    })
  })

  describe('findByRoomId', () => {
    it('should find stories by room id', async () => {
      const expectedStories = [
        {
          id: 1,
          title: 'Test Story 1',
          url: 'https://example.com/1',
          description: 'This is a test story 1',
          isFinished: false,
        },
        {
          id: 2,
          title: 'Test Story 2',
          url: 'https://example.com/2',
          description: 'This is a test story 2',
          isFinished: true,
        },
      ] as Story[]

      jest.spyOn(repository, 'find').mockResolvedValue(expectedStories)

      const result = await service.findByRoomId(1)
      expect(repository.find).toBeCalledWith({ where: { roomId: 1 } })
      expect(result).toEqual(expectedStories)
    })
  })

  describe('findByCreatorId', () => {
    it('should find stories by creator id', async () => {
      const creatorId = 1
      const mockStories = [
        {
          id: 1,
          title: 'Story 1',
          description: 'Description 1',
          isFinished: false,
          createdById: creatorId,
          roomId: 1,
        },
        {
          id: 2,
          title: 'Story 2',
          description: 'Description 2',
          isFinished: true,
          createdById: creatorId,
          roomId: 1,
        },
      ] as Story[]

      jest.spyOn(repository, 'find').mockResolvedValue(mockStories)

      const result = await service.findByCreatorId(creatorId)
      expect(result).toEqual(mockStories)
      expect(repository.find).toHaveBeenCalledWith({
        where: { createdById: creatorId },
      })
    })
  })

  describe('update', () => {
    it('should update a story and return the updated story', async () => {
      const id = 1
      const updateStoryDto: Partial<CreateStoryDto> = {
        title: 'Updated Title',
        description: 'Updated Description',
        isFinished: true,
      }
      const updatedStory = {
        id: 1,
        ...updateStoryDto,
        roomId: 1,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Story

      jest.spyOn(repository, 'update').mockResolvedValue(undefined)
      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedStory)

      const result = await service.update(id, updateStoryDto)

      expect(repository.update).toHaveBeenCalledWith(id, updateStoryDto)
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } })
      expect(result).toEqual(updatedStory)
    })
  })

  describe('remove', () => {
    it('should remove a story and return the delete result', async () => {
      const id = 1
      const deleteResult = {
        affected: 1,
        raw: '',
      } as DeleteResult

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult)

      const result = await service.remove(id)

      expect(repository.delete).toHaveBeenCalledWith(id)
      expect(result).toEqual(deleteResult)
    })
  })
})
