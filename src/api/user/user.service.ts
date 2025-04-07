import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { hashUtil } from '../../util/hash/hash.util';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User, // Sequelize 모델
  ) {}

  /**
   * 모든 사용자 정보를 가져와요.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll<User>();
  }

  /**
   * 사용자 식별 정보(uniqueInput)를 이용해 사용자 정보를 조회해요.
   * 예: { id: 10 } 또는 { email: 'someone@example.com' }
   */
  async getUserByUnique(uniqueInput: {
    id?: number;
    email?: string;
  }): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({
      where: { ...uniqueInput },
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
    return user ?? null;
  }

  /**
   * 사용자 비밀번호 정보를 조회해요 (로그인 등에 활용).
   */
  async getUserCoreInfo(uniqueInput: {
    id?: number;
    email?: string;
  }): Promise<Pick<User, 'id' | 'email' | 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { ...uniqueInput },
      attributes: ['id', 'email', 'password'],
    });
    return user ?? null;
  }

  /**
   * 여러 사용자 정보를 가져와요.
   */
  async getUsers(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>; // Sequelize의 where 조건
    orderBy?: Array<[string, string]>; // 예: [['id', 'DESC']] 형태
  }): Promise<Partial<User>[] | null> {
    const { skip, take, where, orderBy } = params;
    const users = await this.userRepository.findAll({
      where,
      offset: skip,
      limit: take,
      order: orderBy,
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
    return users.length ? users : null;
  }

  /**
   * 새로운 사용자를 생성해요.
   */
  async createNewUser(data: {
    email: string;
    name: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await hashUtil(data.password);
    try {
      return await this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
    } catch (error) {
      // SequelizeUniqueConstraintError 등을 여기서 잡아 에러 처리 가능
      // 예시:
      // if (error instanceof UniqueConstraintError) { ... }
      throw new HttpException(
        { message: '알 수 없는 오류가 발생했어요.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 사용자의 정보를 업데이트해요.
   */
  async updateUserInfo(params: {
    where: { id?: number; email?: string };
    data: Partial<User>;
  }): Promise<Partial<User>> {
    const { where, data } = params;
    // returning 옵션을 사용하면, 변경된 값을 반환받을 수 있어요.
    const [count, [updated]] = await this.userRepository.update(data, {
      where,
      returning: true,
    });
    if (count === 0) {
      throw new HttpException(
        { message: '존재하지 않는 사용자예요.' },
        HttpStatus.NOT_FOUND,
      );
    }
    // 비밀번호나 삭제 여부 등 민감한 속성은 제외해서 반환하거나,
    // attributes를 지정할 수도 있어요.
    const updatedData = updated.get({ plain: true });
    delete updatedData.password;
    delete updatedData.deletedAt;
    return updatedData;
  }

  /**
   * 사용자를 삭제해요.
   */
  async removeUser(userDeleteData: DeleteUserDto): Promise<number> {
    // deleteMany 대신 destroy 사용
    return this.userRepository.destroy({
      where: { id: userDeleteData.ids },
    });
  }
}
