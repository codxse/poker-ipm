import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@app/entities/user.entity'
import { PaginationDto } from '@app/dto/pagination.dto'
import { CreateUserDto } from '@app/dto/create-user.dto'

@Injectable()
export class UserService {
  private PAGE_LIMIT = 10

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getPaginatedUsers(
    query: PaginationDto,
  ): Promise<{ data: User[]; page: number; totalItems: number }> {
    const { page } = query
    const pageNumber = page || 1

    const [data, totalItems] = await this.userRepository.findAndCount({
      take: this.PAGE_LIMIT,
      skip: (pageNumber - 1) * this.PAGE_LIMIT,
    })

    if (data.length === 0) return null

    return { data, page: pageNumber, totalItems: totalItems }
  }

  async getByUserId(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id })
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto)
    return await this.userRepository.save(newUser)
  }
}
