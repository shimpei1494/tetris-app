import React from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants/tetris';
import { Tetromino } from '../types/tetris';

interface GameBoardProps {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  ghostPiece?: Tetromino | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  currentPiece, 
  ghostPiece 
}) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add ghost piece
    if (ghostPiece) {
      for (let y = 0; y < ghostPiece.shape.length; y++) {
        for (let x = 0; x < ghostPiece.shape[y].length; x++) {
          if (ghostPiece.shape[y][x]) {
            const boardY = ghostPiece.position.y + y;
            const boardX = ghostPiece.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              if (!displayBoard[boardY][boardX]) {
                displayBoard[boardY][boardX] = 'ghost';
              }
            }
          }
        }
      }
    }
    
    // Add current piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  const displayBoard = renderBoard();

  return (
    <div className="relative">
      <div 
        className="grid gap-[1px] bg-gray-700 p-2 rounded-lg shadow-2xl border border-gray-600"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        }}
      >
        {displayBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`
                w-6 h-6 border border-gray-800 transition-all duration-150
                ${cell === 'ghost' 
                  ? 'bg-white bg-opacity-20 border-white border-opacity-40' 
                  : cell 
                    ? 'shadow-lg border-opacity-60' 
                    : 'bg-gray-900 bg-opacity-50'
                }
              `}
              style={{
                backgroundColor: cell && cell !== 'ghost' ? cell : undefined,
                boxShadow: cell && cell !== 'ghost' ? `inset 0 0 0 2px ${cell}40` : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};