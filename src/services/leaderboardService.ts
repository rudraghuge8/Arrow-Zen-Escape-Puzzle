/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { LeaderboardEntry } from './types';
import { storage } from '../storage/storage';

const MOCK_GLOBAL_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, uid: 'p1', displayName: 'Aarav Zen', avatar: 'lion', levelsCleared: 498, totalStars: 1482, updatedAt: '2h ago' },
  { rank: 2, uid: 'p2', displayName: 'Sakura Arrow', avatar: 'fox', levelsCleared: 462, totalStars: 1370, updatedAt: '4h ago' },
  { rank: 3, uid: 'p3', displayName: 'Priya Sharma', avatar: 'panda', levelsCleared: 420, totalStars: 1245, updatedAt: '1d ago' },
  { rank: 4, uid: 'p4', displayName: 'Rohan Deshmukh', avatar: 'frog', levelsCleared: 388, totalStars: 1150, updatedAt: '1d ago' },
  { rank: 5, uid: 'p5', displayName: 'Zenith Master', avatar: 'owl', levelsCleared: 350, totalStars: 1020, updatedAt: '2d ago' },
  { rank: 6, uid: 'p6', displayName: 'Ananya K.', avatar: 'octo', levelsCleared: 312, totalStars: 915, updatedAt: '2d ago' },
  { rank: 7, uid: 'p7', displayName: 'Cloud Drifter', avatar: 'unicorn', levelsCleared: 275, totalStars: 805, updatedAt: '3d ago' },
  { rank: 8, uid: 'p8', displayName: 'Vikram Singh', avatar: 'penguin', levelsCleared: 230, totalStars: 670, updatedAt: '4d ago' },
];

const MOCK_WEEKLY_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, uid: 'w1', displayName: 'Priya Sharma', avatar: 'panda', levelsCleared: 64, totalStars: 192, updatedAt: '1h ago' },
  { rank: 2, uid: 'w2', displayName: 'Aarav Zen', avatar: 'lion', levelsCleared: 58, totalStars: 174, updatedAt: '3h ago' },
  { rank: 3, uid: 'w3', displayName: 'Rohan Deshmukh', avatar: 'frog', levelsCleared: 51, totalStars: 151, updatedAt: '5h ago' },
  { rank: 4, uid: 'w4', displayName: 'Sakura Arrow', avatar: 'fox', levelsCleared: 44, totalStars: 130, updatedAt: '8h ago' },
  { rank: 5, uid: 'w5', displayName: 'Zenith Master', avatar: 'owl', levelsCleared: 39, totalStars: 115, updatedAt: '1d ago' },
];

class LeaderboardService {
  public async getLeaderboard(type: 'global' | 'weekly'): Promise<LeaderboardEntry[]> {
    const data = storage.getData();
    const list = type === 'global' ? [...MOCK_GLOBAL_ENTRIES] : [...MOCK_WEEKLY_ENTRIES];

    // Insert current player dynamically based on their progress
    const playerName = data.profile?.name || 'You';
    const playerAvatar = data.profile?.avatar || 'fox';
    const playerCleared = Math.max(0, data.unlockedLevel - 1);
    const playerStars = data.totalStars;

    // Check if player ranks within the list
    const playerEntry: LeaderboardEntry = {
      rank: 1,
      uid: 'current_user',
      displayName: `${playerName} (You)`,
      avatar: playerAvatar,
      levelsCleared: type === 'weekly' ? Math.min(playerCleared, 35) : playerCleared,
      totalStars: type === 'weekly' ? Math.min(playerStars, 105) : playerStars,
      updatedAt: 'Just now',
    };

    const combined = [...list, playerEntry];
    combined.sort((a, b) => b.levelsCleared - a.levelsCleared || b.totalStars - a.totalStars);

    return combined.slice(0, 10).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }
}

export const leaderboardService = new LeaderboardService();
