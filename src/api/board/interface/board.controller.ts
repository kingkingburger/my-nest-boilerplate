import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { BoardService } from '../application/board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from '../domain/board.entity';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll(): Promise<Board[]> {
    return this.boardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    const board = await this.boardService.findById(id);
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() board: Partial<Board>,
  ): Promise<Board> {
    return this.boardService.update(id, board as Board);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.boardService.delete(id);
  }
}
