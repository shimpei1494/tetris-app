import React from 'react';
import { Tetromino } from '../types/tetris';

interface NextPieceProps {
  piece: Tetromino | null;
  title: string;
}

export const NextPiece: React.FC<NextPieceProps> = ({ piece, title }) => {
  if (!piece) return null;

  return (
    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-600">
      <h3 className="text-white text-sm font-semibold mb-2 text-center">{title}</h3>
      <div className="flex justify-center">
        <div 
          className="grid gap-[1px] bg-gray-700 p-2 rounded"
          style={{
            gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`,
          }}
        >
          {piece.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`w-4 h-4 border border-gray-800 ${
                  cell ? 'shadow-md' : 'bg-gray-900 bg-opacity-30'
                }`}
                style={{
                  backgroundColor: cell ? piece.color : undefined,
                  boxShadow: cell ? `inset 0 0 0 1px ${piece.color}60` : undefined,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};