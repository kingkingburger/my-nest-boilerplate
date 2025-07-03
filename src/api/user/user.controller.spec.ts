import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

const mockUserService = {
  createUser: jest.fn(),
  findByEmail: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signupUser', () => {
    it('should call userService.createUser and return the result', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const user = { id: 1, ...createUserDto };
      mockUserService.createUser.mockResolvedValue(user);

      const result = await controller.signupUser(createUserDto);

      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(user);
    });
  });

  describe('getUser', () => {
    it('should call userService.findByEmail and return the user', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, password: 'password', name: 'Test User' };
      mockUserService.findByEmail.mockResolvedValue(user);

      const result = await controller.getUser(email);

      expect(service.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'notfound@example.com';
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(controller.getUser(email)).rejects.toThrow(NotFoundException);
    });
  });
});
