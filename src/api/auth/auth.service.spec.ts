import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { verifyPassword } from '../../util/hash/hash.util';

jest.mock('../../util/hash/hash.util', () => ({
  verifyPassword: jest.fn(),
}));

const mockUserService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', name: 'Test' };
      mockUserService.findByEmail.mockResolvedValue(user);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('test_token');

      const result = await service.signIn({ email: 'test@example.com', password: 'password' });

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(verifyPassword).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ userId: 1, username: 'test@example.com' }, { expiresIn: '1d' });
      expect(result).toEqual({ accessToken: 'test_token' });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      await expect(service.signIn({ email: 'wrong@example.com', password: 'password' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', name: 'Test' };
      mockUserService.findByEmail.mockResolvedValue(user);
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn({ email: 'test@example.com', password: 'wrongpassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
