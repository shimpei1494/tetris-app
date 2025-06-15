import React, { useState } from 'react';
import { GameBoard } from './GameBoard';
import { NextPiece } from './NextPiece';
import { GameStatsComponent } from './GameStats';
import { GameControls } from './GameControls';
import { LevelSelect } from './LevelSelect';
import { useTetris } from '../hooks/useTetris';

export const Tetris: React.FC = () => {
  const { gameState, pieceStats, ghostPiece, actions } = useTetris();
  const [selectLevel, setSelectLevel] = useState(true);

  const gameStats = {
    score: gameState.score,
    level: gameState.level,
    lines: gameState.lines,
    pieces: pieceStats,
  };

  const startGame = (level: number) => {
    actions.resetGame(level);
    setSelectLevel(false);
  };

  const handleRestart = () => {
    setSelectLevel(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TETRIS
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Modern Block Puzzle Game</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          {/* Left Panel */}
          <div className="flex flex-col gap-4 lg:w-64">
            <NextPiece piece={gameState.holdPiece} title="Hold" />
            <GameStatsComponent stats={gameStats} />
          </div>

          {/* Game Board */}
          <div className="flex-shrink-0">
            <GameBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              ghostPiece={ghostPiece}
            />
            
            {gameState.gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-600 text-center">
                  <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over</h2>
                  <p className="text-gray-300 mb-2">Final Score: {gameState.score.toLocaleString()}</p>
                  <p className="text-gray-300 mb-6">Level: {gameState.level}</p>
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {gameState.paused && !gameState.gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-600 text-center">
                  <h2 className="text-3xl font-bold text-yellow-400 mb-4">Paused</h2>
                  <p className="text-gray-300 mb-6">Press P or click Resume to continue</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-4 lg:w-64">
            <NextPiece piece={gameState.nextPiece} title="Next" />
            <GameControls
              isPaused={gameState.paused}
              onTogglePause={actions.togglePause}
              onRestart={handleRestart}
            />
          </div>
        </div>

        <footer className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Use arrow keys to move, spacebar for hard drop, C to hold piece
          </p>
        </footer>
      </div>
      {selectLevel && <LevelSelect onStart={startGame} />}
    </div>
  );
};