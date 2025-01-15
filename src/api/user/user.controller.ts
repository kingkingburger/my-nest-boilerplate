import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { user } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async signupUser(@Body() @Body() userData: CreateUserDto): Promise<user> {
    return this.userService.createNewUser(userData);
  }

  @Get('/id/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserByUnique({ id: +id });
  }
}
