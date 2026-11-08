/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DirectionIndex = 0 | 1 | 2 | 3; // 0: Right, 1: Down, 2: Left, 3: Up

export interface DirectionVec {
  readonly dx: number;
  readonly dy: number;
}

export const DIRECTIONS: readonly DirectionVec[] = [
  { dx: 1, dy: 0 },  // 0: Right
  { dx: 0, dy: 1 },  // 1: Down
  { dx: -1, dy: 0 }, // 2: Left
  { dx: 0, dy: -1 }, // 3: Up
] as const;

export interface ArrowData {
  id: number;
  /** List of cell indices (y * n + x) from tail (c[0]) to head (c[length - 1]) */
  c: number[];
  /** Direction of arrow head (0..3) */
  d: DirectionIndex;
}

export interface RuntimeArrow extends ArrowData {
  /** Trajectory points [[x0, y0], [x1, y1], ...] */
  trajectory: [number, number][];
  exitLength: number;
  isMoving: boolean;
  isGone: boolean;
  moveProgress: number; // 0..1
  moveStartTime: number;
  slideOffset: number;
  highlightUntil: number; // timestamp
  blockedFlashUntil: number; // timestamp
  blockedShakeTime: number; // timestamp
  blockedJitterTime: number; // timestamp for high-frequency blocked rattle
  isPressed?: boolean;
  pressTime?: number; // timestamp when pointer pressed on arrow
  pressReleaseTime?: number; // timestamp when press released to spring back
}

export interface LevelData {
  levelNumber: number;
  worldIndex: number;
  worldName: string;
  shapeName: string;
  gridSize: number; // n x n
  shapeMask: number[]; // 1 for active cells, 0 for empty
  arrows: ArrowData[];
  par: number; // minimal round batches
  difficultyScore: number;
  isReliefLevel?: boolean;
  isSpecialLevel?: boolean;
}

export interface CompactLevelData {
  l: number; // levelNumber
  n: number; // gridSize
  s: string; // shapeName
  m: string; // run-length or bitmask of shape
  a: Array<[number[], DirectionIndex]>; // [[cells, direction], ...]
  p: number; // par
  ds: number; // difficulty score
  r?: 1; // relief level
  b?: 1; // boss/special level
}

export interface SolverResult {
  solvable: boolean;
  par: number;
  steps: number[];
  difficultyScore: number;
  totalArrows: number;
  avgArrowLength: number;
  initialFreeCount: number;
}

export type ArrowSkinId = 'round' | 'sharp' | 'neon' | 'pixel';

export type ThemeId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ThemeColors {
  id: ThemeId;
  name: string;
  bg: string;
  line: string;
  drop: string;
  accent: string;
  cardBg: string;
}

export type BoosterType = 'bomb' | 'xray' | 'extraDrop';

export interface GameStats {
  levelsCleared: number;
  totalStars: number;
  flawlessWins: number;
  todayLevelsCleared: number;
  todayDateStr: string;
  streakDays: number;
  lastLoginDateStr: string;
  coins: number;
  hintsRemaining: number;
  boosters: Record<BoosterType, number>;
  unlockedSkins: ArrowSkinId[];
  unlockedThemes: ThemeId[];
  activeSkin: ArrowSkinId;
  activeTheme: ThemeId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  voiceEnabled: boolean;
  masterVolume: number; // 0..100
  idleHelpEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeTapTargets: boolean;
  language: 'en' | 'hi' | 'mr';
}
