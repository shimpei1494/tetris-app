import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  getRandomTetromino,
  rotatePiece,
  isValidPosition,
  placePiece,
  clearLines,
  calculateScore,
  calculateLevel,
  calculateDropTime,
  isGameOver,
} from '../tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_SHAPES } from '../../constants/tetris';

describe('Tetris Utils', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(BOARD_HEIGHT);
      expect(board[0]).toHaveLength(BOARD_WIDTH);
    });

    it('should create a board filled with null values', () => {
      const board = createEmptyBoard();
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeNull();
        });
      });
    });
  });

  describe('getRandomTetromino', () => {
    it('should return a valid tetromino', () => {
      const tetromino = getRandomTetromino();
      expect(tetromino).toHaveProperty('type');
      expect(tetromino).toHaveProperty('shape');
      expect(tetromino).toHaveProperty('position');
      expect(tetromino).toHaveProperty('color');
    });

    it('should have a valid shape from TETROMINO_SHAPES', () => {
      const tetromino = getRandomTetromino();
      expect(TETROMINO_SHAPES[tetromino.type]).toEqual(tetromino.shape);
    });

    it('should start at a valid position', () => {
      const tetromino = getRandomTetromino();
      expect(tetromino.position.x).toBeGreaterThanOrEqual(0);
      expect(tetromino.position.x).toBeLessThan(BOARD_WIDTH);
      expect(tetromino.position.y).toBe(0);
    });
  });

  describe('rotatePiece', () => {
    it('should rotate a T-piece correctly', () => {
      const tPiece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: 0, y: 0 },
        color: '#FF1493',
      };

      const rotated = rotatePiece(tPiece);
      expect(rotated.shape).toEqual([
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ]);
    });

    it('should not modify the original piece', () => {
      const original = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: 0, y: 0 },
        color: '#FF1493',
      };
      const originalShape = JSON.parse(JSON.stringify(original.shape));

      rotatePiece(original);
      expect(original.shape).toEqual(originalShape);
    });
  });

  describe('isValidPosition', () => {
    const board = createEmptyBoard();

    it('should return true for valid position', () => {
      const piece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: 3, y: 0 },
        color: '#FF1493',
      };
      expect(isValidPosition(board, piece)).toBe(true);
    });

    it('should return false for position out of left bound', () => {
      const piece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: -1, y: 0 },
        color: '#FF1493',
      };
      expect(isValidPosition(board, piece)).toBe(false);
    });

    it('should return false for position out of right bound', () => {
      const piece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: BOARD_WIDTH - 1, y: 0 },
        color: '#FF1493',
      };
      expect(isValidPosition(board, piece)).toBe(false);
    });

    it('should return false for position out of bottom bound', () => {
      const piece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: 3, y: BOARD_HEIGHT - 1 },
        color: '#FF1493',
      };
      expect(isValidPosition(board, piece)).toBe(false);
    });
  });

  describe('placePiece', () => {
    it('should place piece on board correctly', () => {
      const board = createEmptyBoard();
      const piece = {
        type: 'O' as const,
        shape: TETROMINO_SHAPES.O,
        position: { x: 0, y: 0 },
        color: '#FFD700',
      };

      const newBoard = placePiece(board, piece);
      expect(newBoard[0][0]).toBe('#FFD700');
      expect(newBoard[0][1]).toBe('#FFD700');
      expect(newBoard[1][0]).toBe('#FFD700');
      expect(newBoard[1][1]).toBe('#FFD700');
    });

    it('should not modify the original board', () => {
      const board = createEmptyBoard();
      const piece = {
        type: 'O' as const,
        shape: TETROMINO_SHAPES.O,
        position: { x: 0, y: 0 },
        color: '#FFD700',
      };

      placePiece(board, piece);
      expect(board[0][0]).toBeNull();
    });
  });

  describe('clearLines', () => {
    it('should clear completed lines', () => {
      const board = createEmptyBoard();
      // Fill bottom row completely
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = '#FF0000';
      }

      const result = clearLines(board);
      expect(result.linesCleared).toBe(1);
      expect(result.newBoard[BOARD_HEIGHT - 1].every(cell => cell === null)).toBe(true);
    });

    it('should return 0 lines cleared when no complete lines', () => {
      const board = createEmptyBoard();
      const result = clearLines(board);
      expect(result.linesCleared).toBe(0);
      expect(result.newBoard).toEqual(board);
    });

    it('should clear multiple lines', () => {
      const board = createEmptyBoard();
      // Fill last two rows completely
      for (let y = BOARD_HEIGHT - 2; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = '#FF0000';
        }
      }

      const result = clearLines(board);
      expect(result.linesCleared).toBe(2);
    });
  });

  describe('calculateScore', () => {
    it('should calculate score correctly for single line', () => {
      expect(calculateScore(1, 0)).toBe(40);
      expect(calculateScore(1, 1)).toBe(80);
    });

    it('should calculate score correctly for tetris', () => {
      expect(calculateScore(4, 0)).toBe(1200);
      expect(calculateScore(4, 1)).toBe(2400);
    });

    it('should return 0 for no lines cleared', () => {
      expect(calculateScore(0, 0)).toBe(0);
    });
  });

  describe('calculateLevel', () => {
    it('should calculate level correctly', () => {
      expect(calculateLevel(0)).toBe(0);
      expect(calculateLevel(9)).toBe(0);
      expect(calculateLevel(10)).toBe(1);
      expect(calculateLevel(25)).toBe(2);
    });
  });

  describe('calculateDropTime', () => {
    it('should return correct drop time for level 0', () => {
      expect(calculateDropTime(0)).toBe(1000);
    });

    it('should return decreasing drop time for higher levels', () => {
      expect(calculateDropTime(1)).toBe(900);
      expect(calculateDropTime(5)).toBe(500);
    });

    it('should return minimum drop time for very high levels', () => {
      expect(calculateDropTime(20)).toBe(100);
    });
  });

  describe('isGameOver', () => {
    it('should return false when piece can be placed', () => {
      const board = createEmptyBoard();
      const piece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: 3, y: 0 },
        color: '#FF1493',
      };
      expect(isGameOver(board, piece)).toBe(false);
    });

    it('should return true when piece cannot be placed', () => {
      const board = createEmptyBoard();
      // Block the spawn area
      board[0][3] = '#FF0000';
      board[0][4] = '#FF0000';
      board[0][5] = '#FF0000';

      const piece = {
        type: 'T' as const,
        shape: TETROMINO_SHAPES.T,
        position: { x: 3, y: 0 },
        color: '#FF1493',
      };
      expect(isGameOver(board, piece)).toBe(true);
    });
  });
});