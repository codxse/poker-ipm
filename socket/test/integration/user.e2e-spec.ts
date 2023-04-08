import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RootModule } from '@app/root.module';
import { User } from '@app/entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { configOption } from '@app/typeorm.config'
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { seedUsers } from '@app/_db/seeds/user.seed';
import { response } from 'express';

describe('User (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule, TypeOrmModule.forRoot(configOption)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const token = getDataSourceToken(configOption)
    connection = moduleFixture.get(token)
  });

  afterEach(async () => {
    await connection.getRepository(User).clear()
    await app.close();
  });

  describe('/api/users (GET)', () => {
    it('should return the first page if no search query ?page', async () => {
      await seedUsers(connection, 15);

      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(response.body.data).toHaveLength(10);
          expect(response.body.page).toEqual(1);
        });
    });

    it('should return the specified page if searcg query ?page is provided', async () => {
      await seedUsers(connection, 20);

      return request(app.getHttpServer())
        .get('/api/users?page=2')
        .expect(200)
        .then((response) => {
          expect(response.body.data).toHaveLength(10);
          expect(response.body.page).toEqual(2);
        });
    });

    it('should return the bad request (400) if search query ?page value is not correct value', async () => {
      await seedUsers(connection, 20)

      return request(app.getHttpServer())
        .get('/api/users?page=abc')
        .expect(400)
    });

    it('should return the not found (404) if search query ?page value is not found', async () => {
      await seedUsers(connection, 1);

      return request(app.getHttpServer())
        .get('/api/users?page=100')
        .expect(404)
    });
  })
});