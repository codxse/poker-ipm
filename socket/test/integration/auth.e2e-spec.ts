import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RootModule } from '@app/root.module';
import { AuthService } from '@app/services/auth.service';
import { response } from 'express';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
    })
    .overrideProvider(AuthService)
    .useValue({
      signInWithRefreshToken: jest.fn().mockResolvedValue({ accessToken: 'jwtAccessToken' }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/refresh (POST)', async () => {
    const refreshToken = 'jwtRefreshToken';

    const expectedAccessToken = 'jwtAccessToken';

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({ accessToken: expectedAccessToken });
  });
});
