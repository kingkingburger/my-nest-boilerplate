import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PostgresService } from '../../config/database/postgres/postgres.service';
import { CreateUserDto } from './dto/create-user.dto';

const mockPostgresService = {
  query: jest.fn(),
};

describe('UserRepository', () => {
  let repository: UserRepository;
  let db: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PostgresService,
          useValue: mockPostgresService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    db = module.get<PostgresService>(PostgresService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, password: 'hashedpassword', name: 'Test User' };
      mockPostgresService.query.mockResolvedValue({ rows: [user] });

      const result = await repository.findByEmail(email);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [email]);
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const email = 'notfound@example.com';
      mockPostgresService.query.mockResolvedValue({ rows: [] });

      const result = await repository.findByEmail(email);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [email]);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      const createdUser = { id: 2, ...createUserDto };
      mockPostgresService.query.mockResolvedValue({ rows: [createdUser] });

      const result = await repository.createUser(createUserDto);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
        [createUserDto.email, createUserDto.password, createUserDto.name],
      );
      expect(result).toEqual(createdUser);
    });
  });
});
