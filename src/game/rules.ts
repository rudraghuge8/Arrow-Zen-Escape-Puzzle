/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIRECTIONS, type ArrowData, type DirectionIndex } from './types';

/**
 * Checks if the arrow's escape path from its head is clear.
 * Returns the blocker arrow ID if blocked, or -1 if the path is completely clear to exit.
 */
export function findBlocker(
  arrow: ArrowData,
  occupancyMap: Int16Array,
  gridSize: number
): number {
  const headIndex = arrow.c[arrow.c.length - 1];
  const headX = headIndex % gridSize;
  const headY = Math.floor(headIndex / gridSize);
  const dir = DIRECTIONS[arrow.d];

  let x = headX + dir.dx;
  let y = headY + dir.dy;

  while (x >= 0 && y >= 0 && x < gridSize && y < gridSize) {
    const occupant = occupancyMap[y * gridSize + x];
    if (occupant >= 0 && occupant !== arrow.id) {
      return occupant;
    }
    x += dir.dx;
    y += dir.dy;
  }

  return -1;
}

/**
 * Returns an array of arrow IDs that are currently free to escape.
 */
export function getFreeArrows(
  arrows: ArrowData[],
  occupancyMap: Int16Array,
  gridSize: number,
  isAlive: (arrowId: number) => boolean
): number[] {
  const freeIds: number[] = [];
  for (const arrow of arrows) {
    if (!isAlive(arrow.id)) continue;
    if (findBlocker(arrow, occupancyMap, gridSize) < 0) {
      freeIds.push(arrow.id);
    }
  }
  return freeIds;
}

/**
 * Calculates star rating (1 to 3 stars) based on drops lost and round efficiency.
 */
export function calculateStars(
  dropsLost: number,
  roundsTaken: number,
  parRounds: number
): number {
  if (dropsLost === 0 && roundsTaken <= Math.max(parRounds + 2, Math.ceil(parRounds * 1.25))) {
    return 3;
  }
  if (dropsLost <= 1) {
    return 2;
  }
  return 1;
}

/**
 * Calculates level completion coin reward.
 */
export function calculateCoinReward(
  stars: number,
  isFirstClear: boolean,
  comboMax: number
): number {
  let coins = stars * 15;
  if (isFirstClear) {
    coins += 25;
  }
  if (comboMax >= 3) {
    coins += Math.min(30, comboMax * 5);
  }
  return coins;
}

/**
 * Builds the initial occupancy map for a set of arrows.
 */
export function buildOccupancyMap(arrows: ArrowData[], gridSize: number): Int16Array {
  const map = new Int16Array(gridSize * gridSize).fill(-1);
  for (const arrow of arrows) {
    for (const cell of arrow.c) {
      map[cell] = arrow.id;
    }
  }
  return map;
}

/**
 * Distance from point (px, py) to line segment (ax, ay) -> (bx, by) in grid units.
 */
export function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const projX = ax + t * dx;
  const projY = ay + t * dy;
  return Math.hypot(px - projX, py - projY);
}
