import React from 'react';
import { GameStats } from '../types/tetris';

interface GameStatsProps {
  stats: GameStats;
}

export const GameStatsComponent: React.FC<GameStatsProps> = ({ stats }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-600">
      <h3 className="text-white text-lg font-bold mb-3 text-center">Statistics</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Score:</span>
          <span className="text-yellow-400 font-bold">{stats.score.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Level:</span>
          <span className="text-green-400 font-bold">{stats.level}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Lines:</span>
          <span className="text-blue-400 font-bold">{stats.lines}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-600">
        <h4 className="text-white text-sm font-semibold mb-2">Pieces</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {Object.entries(stats.pieces).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-gray-400">{type}:</span>
              <span className="text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};