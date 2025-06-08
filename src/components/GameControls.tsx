import React from 'react';
import { Play, Pause, RotateCw, ArrowDown, ArrowLeft, ArrowRight, Space } from 'lucide-react';

interface GameControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  isPaused, 
  onTogglePause, 
  onRestart 
}) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-600">
      <h3 className="text-white text-lg font-bold mb-3 text-center">Controls</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">Move Left</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowRight className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">Move Right</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowDown className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">Soft Drop</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Space className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">Hard Drop</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RotateCw className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">Rotate (↑)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-orange-400 font-bold">C</span>
          <span className="text-gray-300">Hold Piece</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={onTogglePause}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        
        <button
          onClick={onRestart}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
};