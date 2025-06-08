import { TetrominoType } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const PREVIEW_SIZE = 4;

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00F5FF', // Cyan
  O: '#FFD700', // Gold
  T: '#FF1493', // Deep Pink
  S: '#32CD32', // Lime Green
  Z: '#FF4500', // Orange Red
  J: '#4169E1', // Royal Blue
  L: '#FF8C00', // Dark Orange
};

// より緩やかな速度変化に調整
export const INITIAL_DROP_TIME = 1000; // 1秒
export const MIN_DROP_TIME = 100; // 最速でも0.1秒
export const LEVEL_SPEED_INCREASE = 0.95; // より緩やかな加速（0.9から0.95に変更）
export const POINTS_PER_LINE = [0, 40, 100, 300, 1200];

// レベル別の落下時間テーブル（より制御しやすい）
export const DROP_TIME_BY_LEVEL: Record<number, number> = {
  0: 1000,  // 1.0秒
  1: 900,   // 0.9秒
  2: 800,   // 0.8秒
  3: 700,   // 0.7秒
  4: 600,   // 0.6秒
  5: 500,   // 0.5秒
  6: 450,   // 0.45秒
  7: 400,   // 0.4秒
  8: 350,   // 0.35秒
  9: 300,   // 0.3秒
  10: 250,  // 0.25秒
  11: 200,  // 0.2秒
  12: 150,  // 0.15秒
  13: 120,  // 0.12秒
  14: 100,  // 0.1秒（最速）
};