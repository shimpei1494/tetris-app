import React, { useState } from 'react';
import { MAX_LEVEL } from '../constants/tetris';

interface LevelSelectProps {
  onStart: (level: number) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ onStart }) => {
  const [level, setLevel] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const bounded = Math.min(MAX_LEVEL, Math.max(0, value));
      setLevel(bounded);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-600 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Select Starting Level</h2>
        <input
          type="number"
          min={0}
          max={MAX_LEVEL}
          value={level}
          onChange={handleChange}
          className="w-24 text-center mb-4 p-1 bg-gray-700 text-white rounded"
        />
        <div>
          <button
            onClick={() => onStart(level)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};
