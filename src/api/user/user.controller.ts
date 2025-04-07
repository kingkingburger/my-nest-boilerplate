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

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetUserListDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './user.entity';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 새로운 사용자 등록
   */
  @Post('/create')
  async signupUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createNewUser(userData);
  }

  /**
   * 특정 사용자 조회 (ID 기준)
   */
  @Get('/id/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserByUnique({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * 여러 사용자 조회 (검색, 정렬, 페이징)
   */
  @Get('/list')
  async getUserList(@Query() query: GetUserListDto) {
    // 프론트에서 where나 orderBy를 JSON 문자열로 넘겨준 경우, 파싱 처리
    const whereObj = query.where ? JSON.parse(query.where) : undefined;
    // 예: [['id','DESC']] 형태로 넘겨주면 orderByObj가 Array<[string, string]> 가 돼요.
    const orderByObj = query.orderBy ? JSON.parse(query.orderBy) : undefined;

    const users = await this.userService.getUsers({
      skip: +query.skip,
      take: +query.take,
      where: whereObj,
      orderBy: orderByObj,
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('User not found');
    }
    return users;
  }

  /**
   * 사용자 정보 업데이트 (ID 기준)
   */
  @Put('/update/id/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this.userService.updateUserInfo({
      where: { id },
      data: userData,
    });
  }

  /**
   * 여러 사용자 삭제
   */
  @Delete()
  async deleteUser(@Body() userDeleteData: DeleteUserDto) {
    return this.userService.removeUser(userDeleteData);
  }
}
