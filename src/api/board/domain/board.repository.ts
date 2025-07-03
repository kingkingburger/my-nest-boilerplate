import { Board } from './board.entity';

export abstract class BoardRepository {
  abstract findById(id: number): Promise<Board | null>;
  abstract findAll(): Promise<Board[]>;
  abstract create(board: Board): Promise<Board>;
  abstract update(id: number, board: Board): Promise<Board>;
  abstract delete(id: number): Promise<void>;
}
