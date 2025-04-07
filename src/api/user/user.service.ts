import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';

import { PrismaService } from '../../config/database/prisma.service';
import { hashUtil } from '../../util/hash/hash.util';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 식별 정보(uniqueInput)를 이용해 사용자 정보를 조회해요.
   */
  async getUserByUnique(
    uniqueInput: Prisma.userWhereUniqueInput,
  ): Promise<Omit<user, 'password' | 'deletedAt'> | null> {
    return this.prisma.user.findUnique({
      where: uniqueInput,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * 사용자 비밀번호 정보를 조회해요.
   */
  async getUserCoreInfo(
    uniqueInput: Prisma.userWhereUniqueInput,
  ): Promise<Pick<user, 'id' | 'email' | 'password'> | null> {
    return this.prisma.user.findUnique({
      where: uniqueInput,
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  /**
   * 여러 사용자 정보를 가져와요.
   */
  async getUsers(params: {
    skip?: number;
    take?: number;
    where?: Prisma.userWhereInput;
    orderBy?: Prisma.userOrderByWithRelationInput;
  }): Promise<Omit<user, 'password' | 'deletedAt'>[] | null> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * 새로운 사용자를 생성해요.
   */
  async createNewUser(data: Prisma.userCreateInput): Promise<user> {
    const hashedPassword = await hashUtil(data.password);
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword, // 해싱된 패스워드를 저장해요.
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const targetFields = error.meta?.target;
        if (Array.isArray(targetFields) && targetFields.includes('email')) {
          throw new HttpException(
            { message: '이미 사용 중인 이메일입니다.' },
            HttpStatus.CONFLICT,
          );
        }
        if (Array.isArray(targetFields) && targetFields.includes('name')) {
          throw new HttpException(
            { message: '이미 사용 중인 이름입니다.' },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(
        { message: '알 수 없는 오류가 발생했습니다.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 사용자의 정보를 업데이트해요.
   */
  async updateUserInfo(params: {
    where: Prisma.userWhereUniqueInput;
    data: Prisma.userUpdateInput;
  }): Promise<Omit<user, 'password' | 'deletedAt'>> {
    const { where, data } = params;

    return this.prisma.user.update({
      data,
      where,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * 사용자를 삭제해요.
   */
  async removeUser(userDeleteData: DeleteUserDto) {
    return this.prisma.user.deleteMany({
      where: { id: { in: userDeleteData.ids } },
    });
  }
}
