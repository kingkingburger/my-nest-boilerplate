import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { hashUtil } from '../../util/hash/hash.util';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashUtil(createUserDto.password);
    try {
      return await this.userRepository.createUser({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new HttpException(
        { message: 'User creation failed.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}