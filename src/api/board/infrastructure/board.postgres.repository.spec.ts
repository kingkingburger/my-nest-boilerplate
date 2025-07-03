import { Test, TestingModule } from '@nestjs/testing';
import { BoardPostgresRepository } from './board.postgres.repository';
import { PostgresService } from '../../../config/database/postgres/postgres.service';
import { Board } from '../domain/board.entity';

const mockPostgresService = {
  query: jest.fn(),
};

describe('BoardPostgresRepository', () => {
  let repository: BoardPostgresRepository;
  let db: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardPostgresRepository,
        {
          provide: PostgresService,
          useValue: mockPostgresService,
        },
      ],
    }).compile();

    repository = module.get<BoardPostgresRepository>(BoardPostgresRepository);
    db = module.get<PostgresService>(PostgresService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  const board: Board = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    author_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe('findById', () => {
    it('should return a board if found', async () => {
      mockPostgresService.query.mockResolvedValue({ rows: [board] });
      const result = await repository.findById(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM boards WHERE id = $1', [1]);
      expect(result).toEqual(board);
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      mockPostgresService.query.mockResolvedValue({ rows: [board] });
      const result = await repository.findAll();
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM boards');
      expect(result).toEqual([board]);
    });
  });

  describe('create', () => {
    it('should create and return a new board', async () => {
      mockPostgresService.query.mockResolvedValue({ rows: [board] });
      const result = await repository.create(board);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO boards (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
        [board.title, board.content, board.author_id],
      );
      expect(result).toEqual(board);
    });
  });

  describe('update', () => {
    it('should update and return the board', async () => {
      mockPostgresService.query.mockResolvedValue({ rows: [board] });
      const result = await repository.update(1, board);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE boards SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [board.title, board.content, 1],
      );
      expect(result).toEqual(board);
    });
  });

  describe('delete', () => {
    it('should delete a board', async () => {
      mockPostgresService.query.mockResolvedValue({ rows: [] });
      await repository.delete(1);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM boards WHERE id = $1', [1]);
    });
  });
});
