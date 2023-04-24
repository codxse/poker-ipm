import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { RootModule } from '@app/root.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configOption } from '@app/typeorm.config'
import { DataSource } from 'typeorm'
import { getDataSourceToken } from '@nestjs/typeorm'
import { seedUsers } from '@app/_db/seeds/user.seed'
import { seedRooms } from '@app/_db/seeds/room.seed'
import { generateTestJwtToken } from '@testhelper/testing'
import { CreateRoomDto } from '@app/dto/create-room.dto'
import { JoinAs } from '@app/entities/participant.entity'

describe('RoomController (e2e)', () => {
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
    const queryRunner = connection.createQueryRunner()
    await queryRunner.query(`
      TRUNCATE participants CASCADE;
      TRUNCATE rooms RESTART IDENTITY CASCADE;
      TRUNCATE users RESTART IDENTITY CASCADE;
    `)
    await app.close()
  })

  describe('/api/rooms (POST)', () => {
    it('should create a new room', async () => {
      const [user] = await seedUsers(connection, 1)
      const accessToken = generateTestJwtToken({
        sub: user.id,
        isVerified: true,
      })

      const createRoomDto = {
        name: 'Test Room',
      } as CreateRoomDto

      const { body, status } = await request(app.getHttpServer())
        .post('/api/rooms')
        .auth(accessToken, { type: 'bearer' })
        .send(createRoomDto)

      expect(status).toBe(201)
      expect(body).toMatchObject({
        id: expect.any(Number),
        name: createRoomDto.name,
        createdBy: expect.objectContaining({
          id: user.id,
        }),
        participants: [
          expect.objectContaining({
            createdAt: expect.any(String),
            joinAs: JoinAs.OBSERVER,
            roomId: expect.any(Number),
            updatedAt: expect.any(String),
            userId: expect.any(Number),
          }),
        ],
      })
    })
  })

  describe('/api/rooms/:id (POST)', () => {
    it('should return 404 when the room does not exist', async () => {
      const [user] = await seedUsers(connection, 1)
      const nonExistentRoomId = 9999

      const accessToken = generateTestJwtToken({
        sub: user.id,
        isVerified: true,
      })

      const { body, status } = await request(app.getHttpServer())
        .post(`/api/rooms/${nonExistentRoomId}`)
        .auth(accessToken, { type: 'bearer' })

      expect(status).toBe(404)
      expect(body).toMatchObject({
        message: 'Room with id 9999 not found',
      })
    })

    it('should not rejoin the room when the user is already a participant', async () => {
      const [user] = await seedUsers(connection, 2)
      const [room] = await seedRooms(connection, user, 1)

      const accessToken = generateTestJwtToken({
        sub: user.id,
        isVerified: true,
      })

      await request(app.getHttpServer())
        .post(`/api/rooms/${room.id}`)
        .auth(accessToken, { type: 'bearer' })

      const { body, status } = await request(app.getHttpServer())
        .post(`/api/rooms/${room.id}`)
        .auth(accessToken, { type: 'bearer' })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        message: 'User is already a participant in the room',
      })
    })

    it('should join the room when the user is not yet a participant', async () => {
      const [user1, user2] = await seedUsers(connection, 2)
      const [room] = await seedRooms(connection, user1, 1)

      const accessToken = generateTestJwtToken({
        sub: user2.id,
        isVerified: true,
      })

      const { status } = await request(app.getHttpServer())
        .post(`/api/rooms/${room.id}`)
        .auth(accessToken, { type: 'bearer' })

      expect(status).toBe(201)
    })
  })
})
