import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { user } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async signupUser(@Body() userData: CreateUserDto): Promise<user> {
    return this.userService.createNewUser(userData);
  }

  @Get('/id/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserByUnique({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
