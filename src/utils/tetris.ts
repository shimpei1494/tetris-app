import { Tetromino, TetrominoType, Position } from '../types/tetris';
import { 
  TETROMINO_SHAPES, 
  TETROMINO_COLORS, 
  BOARD_WIDTH, 
  BOARD_HEIGHT,
  POINTS_PER_LINE,
  INITIAL_DROP_TIME,
  MIN_DROP_TIME,
  DROP_TIME_BY_LEVEL
} from '../constants/tetris';

export const createEmptyBoard = (): (string | null)[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

export const getRandomTetromino = (): Tetromino => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    color: TETROMINO_COLORS[type],
  };
};

export const rotatePiece = (piece: Tetromino): Tetromino => {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map(row => row[i]).reverse()
  );
  
  return { ...piece, shape: rotated };
};

export const isValidPosition = (
  board: (string | null)[][],
  piece: Tetromino,
  offset: Position = { x: 0, y: 0 }
): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offset.x;
        const newY = piece.position.y + y + offset.y;
        
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placePiece = (
  board: (string | null)[][],
  piece: Tetromino
): (string | null)[][] => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: (string | null)[][]): {
  newBoard: (string | null)[][];
  linesCleared: number;
} => {
  const fullLines: number[] = [];
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      fullLines.push(y);
    }
  }
  
  if (fullLines.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }
  
  const newBoard = board.filter((_, index) => !fullLines.includes(index));
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared: fullLines.length };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  return POINTS_PER_LINE[linesCleared] * (level + 1);
};

export const calculateLevel = (lines: number): number => {
  return Math.floor(lines / 10);
};

// より制御しやすい落下時間計算
export const calculateDropTime = (level: number): number => {
  // レベル別テーブルを使用
  if (level in DROP_TIME_BY_LEVEL) {
    return DROP_TIME_BY_LEVEL[level];
  }
  
  // 高レベルの場合は最小時間を返す
  if (level >= 14) {
    return MIN_DROP_TIME;
  }
  
  // フォールバック：緩やかな計算式
  const dropTime = INITIAL_DROP_TIME - (level * 60);
  return Math.max(dropTime, MIN_DROP_TIME);
};

export const isGameOver = (board: (string | null)[][], newPiece: Tetromino): boolean => {
  return !isValidPosition(board, newPiece);
};