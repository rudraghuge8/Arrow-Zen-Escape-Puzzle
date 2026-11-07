/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GameStats, ArrowSkinId, ThemeId, BoosterType } from '../game/types';

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  userId?: string;
  isGuest: boolean;
}

export interface StorageDataV2 {
  version: 2;
  unlockedLevel: number;
  currentLevel: number;
  levelStars: Record<number, number>; // levelNumber -> stars (1..3)
  levelBestRounds: Record<number, number>;
  totalStars: number;
  flawlessWins: number;
  coins: number;
  boosters: Record<BoosterType, number>;
  unlockedSkins: ArrowSkinId[];
  unlockedThemes: ThemeId[];
  activeSkin: ArrowSkinId;
  activeTheme: ThemeId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  voiceEnabled: boolean;
  masterVolume: number;
  idleHelpEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeTapTargets: boolean;
  language: 'en' | 'hi' | 'mr';
  hintsRemaining: number;
  profile: UserProfile | null;
  dailyChallenge: {
    lastDate: string;
    completed: boolean;
    streak: number;
    bestStreak: number;
  };
  loginCalendar: {
    lastClaimDate: string;
    claimedDayCount: number;
  };
  achievements: Record<string, boolean>;
  todayStats: {
    date: string;
    levelsCleared: number;
  };
}

export const DEFAULT_STORAGE_DATA: StorageDataV2 = {
  version: 2,
  unlockedLevel: 1,
  currentLevel: 1,
  levelStars: {},
  levelBestRounds: {},
  totalStars: 0,
  flawlessWins: 0,
  coins: 100, // starting coins
  boosters: {
    bomb: 2,
    xray: 3,
    extraDrop: 2,
  },
  unlockedSkins: ['round'],
  unlockedThemes: [0, 1, 2, 3],
  activeSkin: 'round',
  activeTheme: 0,
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  voiceEnabled: false,
  masterVolume: 65,
  idleHelpEnabled: true,
  reduceMotion: false,
  highContrast: false,
  largeTapTargets: false,
  language: 'en',
  hintsRemaining: 3,
  profile: null,
  dailyChallenge: {
    lastDate: '',
    completed: false,
    streak: 0,
    bestStreak: 0,
  },
  loginCalendar: {
    lastClaimDate: '',
    claimedDayCount: 0,
  },
  achievements: {},
  todayStats: {
    date: new Date().toDateString(),
    levelsCleared: 0,
  },
};
