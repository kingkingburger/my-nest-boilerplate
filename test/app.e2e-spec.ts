import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/api/user/dto/create-user.dto';
import { CreateBoardDto } from '../src/api/board/interface/dto/create-board.dto';
import { PostgresService } from '../src/config/database/postgres/postgres.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let postgresService: PostgresService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    postgresService = app.get<PostgresService>(PostgresService);

    // Clean up database before tests
    await postgresService.query('DELETE FROM boards');
    await postgresService.query('DELETE FROM users');
  });

  afterAll(async () => {
    // Clean up database after tests
    await postgresService.query('DELETE FROM boards');
    await postgresService.query('DELETE FROM users');
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('User Module', () => {
    const createUserDto: CreateUserDto = {
      email: 'test_e2e@example.com',
      password: 'password123',
      name: 'Test E2E User',
    };

    it('/user/create (POST) - should create a user', () => {
      return request(app.getHttpServer())
        .post('/user/create')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toEqual(createUserDto.email);
          expect(res.body.name).toEqual(createUserDto.name);
          expect(res.body.password).toBeUndefined(); // Password should not be returned
        });
    });

    it('/user/email/:email (GET) - should return a user by email', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/email/${createUserDto.email}`)
        .expect(200);

      expect(res.body.email).toEqual(createUserDto.email);
      expect(res.body.name).toEqual(createUserDto.name);
      expect(res.body.password).toBeUndefined();
    });
  });

  describe('Board Module', () => {
    let createdUserId: number;
    let createdBoardId: number;

    beforeAll(async () => {
      // Create a user for board tests
      const userRes = await request(app.getHttpServer())
        .post('/user/create')
        .send({
          email: 'board_user@example.com',
          password: 'password123',
          name: 'Board User',
        });
      createdUserId = userRes.body.id;
    });

    const createBoardDto: CreateBoardDto = {
      title: 'E2E Test Board',
      content: 'This is a test board content.',
      author_id: 0, // Will be set dynamically
    };

    it('/board (POST) - should create a board', () => {
      createBoardDto.author_id = createdUserId;
      return request(app.getHttpServer())
        .post('/board')
        .send(createBoardDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toEqual(createBoardDto.title);
          expect(res.body.content).toEqual(createBoardDto.content);
          expect(res.body.author_id).toEqual(createdUserId);
          createdBoardId = res.body.id;
        });
    });

    it('/board (GET) - should return all boards', () => {
      return request(app.getHttpServer())
        .get('/board')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].title).toEqual(createBoardDto.title);
        });
    });

    it('/board/:id (GET) - should return a single board', () => {
      return request(app.getHttpServer())
        .get(`/board/${createdBoardId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(createdBoardId);
          expect(res.body.title).toEqual(createBoardDto.title);
        });
    });

    it('/board/:id (PATCH) - should update a board', () => {
      const updateData = { title: 'Updated E2E Board' };
      return request(app.getHttpServer())
        .patch(`/board/${createdBoardId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toEqual(updateData.title);
        });
    });

    it('/board/:id (DELETE) - should delete a board', () => {
      return request(app.getHttpServer())
        .delete(`/board/${createdBoardId}`)
        .expect(200);
    });

    it('/board/:id (GET) - should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/board/${createdBoardId}`)
        .expect(404);
    });
  });
});