import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../config/database/postgres/postgres.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly db: PostgresService) {}

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;
    const res = await this.db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name],
    );
    return res.rows[0];
  }
}