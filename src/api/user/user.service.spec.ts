import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { hashUtil } from '../../util/hash/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';

jest.mock('../../util/hash/hash.util', () => ({
  hashUtil: jest.fn(),
}));

const mockUserRepository = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should call repository.findByEmail and return the user', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, password: 'hashedpassword', name: 'Test User' };
      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await service.findByEmail(email);

      expect(repository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should hash the password and create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      const hashedPassword = 'hashed_password';
      const createdUser = { id: 1, ...createUserDto, password: hashedPassword };

      (hashUtil as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.createUser.mockResolvedValue(createdUser);

      const result = await service.createUser(createUserDto);

      expect(hashUtil).toHaveBeenCalledWith(createUserDto.password);
      expect(repository.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw an HttpException if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      const hashedPassword = 'hashed_password';
      (hashUtil as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.createUser.mockRejectedValue(new Error('DB error'));

      await expect(service.createUser(createUserDto)).rejects.toThrow(HttpException);
    });
  });
});
