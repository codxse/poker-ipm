import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@app/controllers/user.controller'
import { UserService } from '@app/services/user.services'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entities/user.entity'
import { getRepositoryToken  } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;
  const userRepositoryMock = {
    find: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile();

    userController = module.get<UserController>(UserController);
  });

  it('should return a list of users as JSON', async () => {
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

    const users = await userController.getUsers();
    expect(users).toEqual(expectedUsers);
  });
});
