import { Module } from '@nestjs/common';
import { BoardController } from './interface/board.controller';
import { BoardService } from './application/board.service';
import { BoardRepository } from './domain/board.repository';
import { BoardPostgresRepository } from './infrastructure/board.postgres.repository';

@Module({
  imports: [],
  controllers: [BoardController],
  providers: [
    BoardService,
    {
      provide: BoardRepository,
      useClass: BoardPostgresRepository,
    },
  ],
  exports: [BoardService],
})
export class BoardModule {}
