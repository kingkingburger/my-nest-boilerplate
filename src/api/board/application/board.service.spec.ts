import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardRepository } from '../domain/board.repository';
import { CreateBoardDto } from '../interface/dto/create-board.dto';
import { Board } from '../domain/board.entity';

const mockBoardRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('BoardService', () => {
  let service: BoardService;
  let repository: BoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: BoardRepository,
          useValue: mockBoardRepository,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    repository = module.get<BoardRepository>(BoardRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const board: Board = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    author_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe('create', () => {
    it('should create a new board', async () => {
      const createDto: CreateBoardDto = { title: 'New Board', content: 'Content', author_id: 1 };
      mockBoardRepository.create.mockResolvedValue(board);

      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(board);
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      mockBoardRepository.findAll.mockResolvedValue([board]);
      const result = await service.findAll();
      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([board]);
    });
  });

  describe('findById', () => {
    it('should return a board if found', async () => {
      mockBoardRepository.findById.mockResolvedValue(board);
      const result = await service.findById(1);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(board);
    });
  });

  describe('update', () => {
    it('should update and return the board', async () => {
      mockBoardRepository.update.mockResolvedValue(board);
      const result = await service.update(1, board);
      expect(repository.update).toHaveBeenCalledWith(1, board);
      expect(result).toEqual(board);
    });
  });

  describe('delete', () => {
    it('should delete the board', async () => {
      mockBoardRepository.delete.mockResolvedValue(undefined);
      await service.delete(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});