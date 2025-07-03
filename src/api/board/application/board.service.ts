import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../domain/board.repository';
import { Board } from '../domain/board.entity';
import { CreateBoardDto } from '../interface/dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = new Board();
    board.title = createBoardDto.title;
    board.content = createBoardDto.content;
    board.author_id = createBoardDto.author_id;
    return this.boardRepository.create(board);
  }

  async findAll(): Promise<Board[]> {
    return this.boardRepository.findAll();
  }

  async findById(id: number): Promise<Board | null> {
    return this.boardRepository.findById(id);
  }

  async update(id: number, board: Board): Promise<Board> {
    return this.boardRepository.update(id, board);
  }

  async delete(id: number): Promise<void> {
    return this.boardRepository.delete(id);
  }
}
