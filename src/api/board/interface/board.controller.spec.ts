import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from '../application/board.service';
import { NotFoundException } from '@nestjs/common';
import { Board } from '../domain/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

const mockBoardService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: mockBoardService,
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const createDto: CreateBoardDto = { title: 'New', content: 'Content', author_id: 1 };
      mockBoardService.create.mockResolvedValue(board);
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(board);
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      mockBoardService.findAll.mockResolvedValue([board]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([board]);
    });
  });

  describe('findOne', () => {
    it('should return a board if found', async () => {
      mockBoardService.findById.mockResolvedValue(board);
      const result = await controller.findOne(1);
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(board);
    });

    it('should throw NotFoundException if board is not found', async () => {
      mockBoardService.findById.mockResolvedValue(null);
      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the board', async () => {
      const updateData = { title: 'Updated' };
      mockBoardService.update.mockResolvedValue({ ...board, ...updateData });
      const result = await controller.update(1, updateData);
      expect(service.update).toHaveBeenCalledWith(1, updateData);
      expect(result.title).toEqual('Updated');
    });
  });

  describe('remove', () => {
    it('should remove the board', async () => {
      mockBoardService.delete.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});