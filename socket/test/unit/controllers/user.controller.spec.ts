import { Test } from '@nestjs/testing'
import { UserController } from '@app/controllers/user.controller'
import { UserService } from '@app/services/user.services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@app/entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PaginationDto } from '@app/dto/pagination.dto'
import { CreateUserDto } from '@app/dto/create-user.dto'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService
  const userRepositoryMock = {
    find: jest.fn(),
    getPaginatedUsers: jest.fn(),
  }

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile()

    userController = testingModule.get<UserController>(UserController)
    userService = testingModule.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
  })

  describe('getUsers', () => {
    it('should return an array of users with pagination', async () => {
      const result = {
        data: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
          },
        ] as User[],
        page: 1,
        totalItems: 2,
      }
      jest
        .spyOn(userService, 'getPaginatedUsers')
        .mockImplementation(() => Promise.resolve(result))

      const paginationDto: PaginationDto = { page: 1 }
      const users = await userController.getUsers(paginationDto)
      expect(users).toBe(result)
    })
  })

  describe('getByUserId', () => {
    it('should return the user with the given ID', async () => {
      const userId = 1
      const user = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      } as User

      jest
        .spyOn(userService, 'getByUserId')
        .mockImplementation(() => Promise.resolve(user))

      const foundUser = await userController.getByUserId(userId)
      expect(foundUser).toBe(user)
    })
  })

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      } as CreateUserDto

      const newUser = {
        id: 1,
        ...createUserDto,
      } as User

      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser)

      const result = await userController.createUser(createUserDto)
      expect(result).toBe(newUser)
    })
  })
})
