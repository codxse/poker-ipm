import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RootModule } from '@app/root.module';
import { User } from '@app/entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configOption } from '@app/typeorm.config'

describe('User (e2e)', () => {
  let app: INestApplication;
  const userRepositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule, TypeOrmModule.forRoot(configOption)],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/users (GET)', () => {
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

    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .expect(expectedUsers);
  });
});