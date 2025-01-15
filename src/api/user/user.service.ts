import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

import { PrismaService } from '../../config/database/prisma.service';
import { hashUtil } from '../../util/hash/hash.util';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 식별 정보(uniqueInput)를 이용해 사용자 정보를 조회해요.
   */
  async getUserByUnique(
    uniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: uniqueInput,
    });
  }

  /**
   * 여러 사용자 정보를 가져와요.
   */
  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  /**
   * 새로운 사용자를 생성해요.
   */
  async createNewUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await hashUtil(data.password);

    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword, // 해싱된 패스워드를 저장해요.
          // salt 필드가 DB에 있다면 함께 저장할 수 있어요.
          // salt: salt,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const targetFields = error.meta?.target;
        if (Array.isArray(targetFields) && targetFields.includes('email')) {
          throw new HttpException(
            '이미 사용 중인 이메일입니다.',
            HttpStatus.CONFLICT,
          );
        }
        if (Array.isArray(targetFields) && targetFields.includes('name')) {
          throw new HttpException(
            '이미 사용 중인 이름입니다.',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(
        '알 수 없는 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 사용자의 정보를 업데이트해요.
   */
  async updateUserInfo(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    // 만약 비밀번호까지 업데이트해야 한다면, 아래와 같이 해싱 처리 가능
    // if (data.password) {
    //   const salt = crypto.randomBytes(16).toString('hex');
    //   data.password = await this.hashPassword(data.password.toString(), salt);
    // }

    return this.prisma.user.update({
      data,
      where,
    });
  }

  /**
   * 사용자를 삭제해요.
   */
  async removeUser(uniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where: uniqueInput,
    });
  }
}
