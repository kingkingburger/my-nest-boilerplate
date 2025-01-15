import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async signupUser(@Body() userData: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createNewUser(userData);
  }

  @Get('/id/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserByUnique({ id: +id });
  }
}
