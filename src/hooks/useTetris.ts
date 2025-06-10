import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Tetromino, TetrominoType } from '../types/tetris';
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
} from '../utils/tetris';

const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: null,
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 0,
  lines: 0,
  gameOver: false,
  paused: false,
  dropTime: 1000,
  lastDrop: 0,
};

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [pieceStats, setPieceStats] = useState<Record<TetrominoType, number>>({
    I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0,
  });
  
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const dropTimeRef = useRef<number>(0);

  const spawnNewPiece = useCallback(() => {
    setGameState(prev => {
      const newPiece = prev.nextPiece || getRandomTetromino();
      const nextPiece = getRandomTetromino();
      
      if (isGameOver(prev.board, newPiece)) {
        return { ...prev, gameOver: true };
      }

      setPieceStats(stats => ({
        ...stats,
        [newPiece.type]: stats[newPiece.type] + 1,
      }));

      return {
        ...prev,
        currentPiece: newPiece,
        nextPiece,
        canHold: true,
        // dropTime: 1000,
      };
    });
  }, []);

  const getGhostPiece = useCallback((piece: Tetromino, board: (string | null)[][]) => {
    let ghostPiece = { ...piece };
    while (isValidPosition(board, ghostPiece, { x: 0, y: 1 })) {
      ghostPiece = { ...ghostPiece, position: { ...ghostPiece.position, y: ghostPiece.position.y + 1 } };
    }
    return ghostPiece;
  }, []);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      const newPosition = {
        x: prev.currentPiece.position.x + deltaX,
        y: prev.currentPiece.position.y + deltaY,
      };

      if (isValidPosition(prev.board, { ...prev.currentPiece, position: newPosition })) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition },
        };
      }

      return prev;
    });
  }, []);

  const rotatePieceAction = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      const rotated = rotatePiece(prev.currentPiece);
      
      if (isValidPosition(prev.board, rotated)) {
        return { ...prev, currentPiece: rotated };
      }

      // Try wall kicks
      const kicks = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }];
      for (const kick of kicks) {
        const kickedPiece = {
          ...rotated,
          position: {
            x: rotated.position.x + kick.x,
            y: rotated.position.y + kick.y,
          },
        };
        if (isValidPosition(prev.board, kickedPiece)) {
          return { ...prev, currentPiece: kickedPiece };
        }
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      const ghostPiece = getGhostPiece(prev.currentPiece, prev.board);
      const dropDistance = ghostPiece.position.y - prev.currentPiece.position.y;
      
      return {
        ...prev,
        currentPiece: ghostPiece,
        score: prev.score + dropDistance * 2,
      };
    });
  }, [getGhostPiece]);

  const holdPieceAction = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused || !prev.canHold) return prev;

      if (!prev.holdPiece) {
        return {
          ...prev,
          holdPiece: { ...prev.currentPiece, position: { x: 4, y: 0 } },
          currentPiece: prev.nextPiece,
          nextPiece: getRandomTetromino(),
          canHold: false,
        };
      } else {
        return {
          ...prev,
          holdPiece: { ...prev.currentPiece, position: { x: 4, y: 0 } },
          currentPiece: { ...prev.holdPiece, position: { x: 4, y: 0 } },
          canHold: false,
        };
      }
    });
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      const newPosition = {
        x: prev.currentPiece.position.x,
        y: prev.currentPiece.position.y + 1,
      };

      if (isValidPosition(prev.board, { ...prev.currentPiece, position: newPosition })) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition },
        };
      } else {
        // Piece has landed
        const newBoard = placePiece(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        const newLines = prev.lines + linesCleared;
        const newLevel = calculateLevel(newLines);
        const pointsEarned = calculateScore(linesCleared, prev.level);

        return {
          ...prev,
          board: clearedBoard,
          currentPiece: null,
          score: prev.score + pointsEarned,
          level: newLevel,
          lines: newLines,
          // dropTime: 1000,
        };
      }
    });
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;

    setGameState(prev => {
      if (prev.gameOver || prev.paused) return prev;

      if (!prev.currentPiece) {
        return prev;
      }

      // 落下時間の累積
      dropTimeRef.current += deltaTime;

      if (dropTimeRef.current >= prev.dropTime) {
        dropTimeRef.current = 0; // リセット
        lastTimeRef.current = timestamp;
        return { ...prev, lastDrop: timestamp };
      }

      lastTimeRef.current = timestamp;
      return prev;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // Effect to handle piece dropping
  useEffect(() => {
    if (gameState.lastDrop && !gameState.gameOver && !gameState.paused && gameState.currentPiece) {
      dropPiece();
    }
  }, [gameState.lastDrop]);

  // Effect to spawn new pieces
  useEffect(() => {
    if (!gameState.currentPiece && !gameState.gameOver) {
      spawnNewPiece();
    }
  }, [gameState.currentPiece, gameState.gameOver]);

  // Game loop effect
  useEffect(() => {
    if (!gameState.gameOver && !gameState.paused) {
      lastTimeRef.current = 0;
      dropTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.gameOver, gameState.paused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotatePieceAction();
          break;
        case 'Space':
          event.preventDefault();
          hardDrop();
          break;
        case 'KeyC':
          event.preventDefault();
          holdPieceAction();
          break;
        case 'KeyP':
          event.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePieceAction, hardDrop, holdPieceAction, gameState.gameOver]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ 
      ...initialGameState, 
      nextPiece: getRandomTetromino() 
    });
    setPieceStats({ I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0 });
    lastTimeRef.current = 0;
    dropTimeRef.current = 0;
  }, []);

  const ghostPiece = gameState.currentPiece ? getGhostPiece(gameState.currentPiece, gameState.board) : null;

  return {
    gameState,
    pieceStats,
    ghostPiece,
    actions: {
      togglePause,
      resetGame,
      movePiece,
      rotatePiece: rotatePieceAction,
      hardDrop,
      holdPiece: holdPieceAction,
    },
  };
};