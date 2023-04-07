import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@app/services/user.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  const userRepositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      providers: [UserService],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile();

    userService = module.get<UserService>(UserService);
  });

  it('should return a list of users', async () => {
    const expectedUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: 'https://example.com/avatar1.jpg',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        avatarUrl: 'https://example.com/avatar2.jpg',
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password',
      },
    ];

    userRepositoryMock.find.mockResolvedValue(expectedUsers);

    const users = await userService.findAll();
    expect(users).toEqual(expectedUsers);
    expect(userRepositoryMock.find).toHaveBeenCalled();
  });
});