import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, user } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetUserListDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@ApiTags('User')
@Controller('/user')
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

  @Get('/list')
  async getUserList(@Query() query: GetUserListDto) {
    // JSON 문자열을 객체로 파싱
    const whereObj = query.where ? JSON.parse(query.where) : undefined;
    const orderByObj = query.orderBy ? JSON.parse(query.orderBy) : undefined;

    const users = await this.userService.getUsers({
      skip: query.skip,
      take: query.take,
      where: whereObj as Prisma.userWhereInput,
      orderBy: orderByObj as Prisma.userOrderByWithRelationInput,
    });

    if (!users) {
      throw new NotFoundException('User not found');
    }
    return users;
  }

  @Put('/update/id/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<Omit<user, 'password' | 'deletedAt'>> {
    return this.userService.updateUserInfo({
      where: { id: id },
      data: userData as Prisma.userUpdateInput,
    });
  }

  @Delete('/user')
  async deleteUser(@Body() userDeleteData: DeleteUserDto) {
    return this.userService.removeUser(userDeleteData);
  }
}
