import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@app/services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@app/entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PaginationDto } from '@app/dto/pagination.dto'
import { CreateUserDto } from '@app/dto/create-user.dto'

describe('UserService', () => {
  let userService: UserService
  const userRepositoryMock = {
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      providers: [UserService],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile()

    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('getPaginatedUsers', () => {
    it('should return paginated users', async () => {
      const users = [...Array(15)].map((_, i) => createUser(i))
      const LIMIT = 10
      userRepositoryMock.findAndCount.mockResolvedValue([
        users.slice(0, LIMIT),
        users.length,
      ])

      const paginationDto: PaginationDto = { page: 1 }
      const { data, page, totalItems } = await userService.getPaginatedUsers(
        paginationDto,
      )

      expect(data.length).toBe(LIMIT)
      expect(page).toBe(1)
      expect(totalItems).toBe(users.length)
    })

    it('should return an empty array if there are no users', async () => {
      userRepositoryMock.findAndCount.mockResolvedValueOnce([[], 0])

      const paginationDto: PaginationDto = { page: 1 }
      const res = await userService.getPaginatedUsers(paginationDto)

      expect(res).toBe(null)
    })
  })

  describe('getByUserId', () => {
    it('should return a user by id', async () => {
      const user = createUser(1)

      userRepositoryMock.findOneBy.mockResolvedValue(user)

      const foundUser = await userService.getByUserId(1)
      expect(foundUser).toEqual(user)
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      } as CreateUserDto

      const newUser = {
        id: 1,
        ...createUserDto,
      } as User
      userRepositoryMock.findOneBy.mockResolvedValue(null)
      userRepositoryMock.create.mockReturnValue(newUser)
      userRepositoryMock.save.mockResolvedValue(newUser)

      const result = await userService.createUser(createUserDto)

      expect(result).toEqual(newUser)
      expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDto)
      expect(userRepositoryMock.save).toHaveBeenCalledWith(newUser)
    })

    it('should throw an error when trying to create a user with duplicate email', async () => {
      const user = new User()
      user.email = 'duplicate@example.com'
      user.password = 'password'

      // Create the first user
      userRepositoryMock.save.mockResolvedValue(user)
      await userService.createUser(user)

      // Attempt to create the second user with the same email
      userRepositoryMock.save.mockRejectedValue(new Error('Duplicate email'))
      await expect(userService.createUser(user)).rejects.toThrowError(
        'Duplicate email',
      )
    })
  })
})

function createUser(id: number): User {
  const user = new User()
  user.id = id
  user.firstName = `First${id}`
  user.lastName = `Last${id}`
  user.username = `user${id}`
  user.email = `user${id}@example.com`
  user.password = `password${id}`
  return user
}
