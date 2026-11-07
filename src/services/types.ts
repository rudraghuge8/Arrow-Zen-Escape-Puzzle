/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  uid: string;
  displayName: string;
  avatar: string;
  levelsCleared: number;
  totalStars: number;
  updatedAt: string;
}

export interface PurchaseItem {
  id: string;
  title: string;
  description: string;
  priceFormatted: string;
  type: 'inapp' | 'subs';
}
