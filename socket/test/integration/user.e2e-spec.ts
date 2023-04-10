import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { RootModule } from '@app/root.module'
import { User } from '@app/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configOption } from '@app/typeorm.config'
import { DataSource } from 'typeorm'
import { getDataSourceToken } from '@nestjs/typeorm'
import { seedUsers } from '@app/_db/seeds/user.seed'
import { CreateUserDto } from '@app/dto/create-user.dto'
import { generateTestJwtToken } from '@testhelper/testing'

describe('User (e2e)', () => {
  let app: INestApplication
  let connection: DataSource

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule, TypeOrmModule.forRoot(configOption)],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const token = getDataSourceToken(configOption)
    connection = moduleFixture.get(token)
  })

  afterEach(async () => {
    await connection.getRepository(User).clear()
    await app.close()
  })

  describe('/api/users (GET)', () => {
    it('should return the first page if no search query ?page', async () => {
      await seedUsers(connection, 15)

      return request(app.getHttpServer())
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(response.body.data).toHaveLength(10)
          expect(response.body.page).toEqual(1)
        })
    })

    it('should return the specified page if searcg query ?page is provided', async () => {
      await seedUsers(connection, 20)

      return request(app.getHttpServer())
        .get('/api/users?page=2')
        .expect(200)
        .then((response) => {
          expect(response.body.data).toHaveLength(10)
          expect(response.body.page).toEqual(2)
        })
    })

    it('should return the bad request (400) if search query ?page value is not correct value', async () => {
      await seedUsers(connection, 20)

      return request(app.getHttpServer()).get('/api/users?page=abc').expect(400)
    })

    it('should return the not found (404) if search query ?page value is not found', async () => {
      await seedUsers(connection, 1)

      return request(app.getHttpServer()).get('/api/users?page=100').expect(404)
    })
  })

  describe('/api/users/:id (GET)', () => {
    it('should return a user by id', async () => {
      const [createdUser] = await seedUsers(connection, 1)
      const user = await connection
        .getRepository(User)
        .findOneBy({ id: createdUser.id })

      return request(app.getHttpServer())
        .get(`/api/users/${user.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          })
        })
    })

    it('should return a 404 not found error if the user id does not exist', async () => {
      return request(app.getHttpServer()).get('/api/users/99999999').expect(404)
    })

    it('should return a 400 bad request error if the user id is not a valid positive integer', async () => {
      return request(app.getHttpServer())
        .get('/api/users/invalid_id')
        .expect(400)
    })
  })

  describe('/api/users (POST)', () => {
    const accessToken = generateTestJwtToken({
      sub: 222,
      isVerified: true
    })

    it('should create a new user and return it', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      } as CreateUserDto

      await request(app.getHttpServer())
        .post('/api/users')
        .auth(accessToken, { type: 'bearer' })
        .send(createUserDto)
        .expect(201)
        .then((response) => {
          expect(response.body.firstName).toBe(createUserDto.firstName)
          expect(response.body.lastName).toBe(createUserDto.lastName)
          expect(response.body.email).toBe(createUserDto.email)
          expect(response.body.isVerified).toBe(true)
          expect(response.body).not.toHaveProperty('password')
        })
    })

    it('should return a bad request error for duplicate email', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      }

      // Create the first user
      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createUserDto)
        .expect(201)

      // Attempt to create the second user with the same email
      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createUserDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Email is already exists.')
        })
    })
  })
})
