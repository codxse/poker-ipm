import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@app/services/user.services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@app/entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PaginationDto } from '@app/dto/pagination.dto'

describe('UserService', () => {
  let userService: UserService
  const userRepositoryMock = {
    find: jest.fn(),
    findAndCount: jest.fn(),
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
