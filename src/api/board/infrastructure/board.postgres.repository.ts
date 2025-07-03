import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../../config/database/postgres/postgres.service';
import { Board } from '../domain/board.entity';
import { BoardRepository } from '../domain/board.repository';

@Injectable()
export class BoardPostgresRepository implements BoardRepository {
  constructor(private readonly db: PostgresService) {}

  async findById(id: number): Promise<Board | null> {
    const res = await this.db.query('SELECT * FROM boards WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findAll(): Promise<Board[]> {
    const res = await this.db.query('SELECT * FROM boards');
    return res.rows;
  }

  async create(board: Board): Promise<Board> {
    const { title, content, author_id } = board;
    const res = await this.db.query(
      'INSERT INTO boards (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author_id],
    );
    return res.rows[0];
  }

  async update(id: number, board: Board): Promise<Board> {
    const { title, content } = board;
    const res = await this.db.query(
      'UPDATE boards SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id],
    );
    return res.rows[0];
  }

  async delete(id: number): Promise<void> {
    await this.db.query('DELETE FROM boards WHERE id = $1', [id]);
  }
}