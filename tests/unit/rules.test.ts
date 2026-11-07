/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { findBlocker, getFreeArrows, calculateStars, calculateCoinReward, buildOccupancyMap, pointToSegmentDistance } from '../../src/game/rules';
import type { ArrowData } from '../../src/game/types';

test('rules: blocker detection finds obstacle in front of arrow head', () => {
  const arrows: ArrowData[] = [
    // Arrow 0: cells [0, 1], head at cell 1 (x=1, y=0), direction 0 (Right)
    { id: 0, c: [0, 1], d: 0 },
    // Arrow 1: cell 3 (x=3, y=0), blocking Arrow 0 along its path
    { id: 1, c: [3], d: 1 },
  ];
  const occupancy = buildOccupancyMap(arrows, 5);

  const blockerFor0 = findBlocker(arrows[0], occupancy, 5);
  assert.equal(blockerFor0, 1, 'Arrow 0 should be blocked by Arrow 1');

  // Arrow 1: direction 1 (Down). Path from cell 3 (x=3, y=0) downwards has cells 8, 13, 18, 23 (all free)
  const blockerFor1 = findBlocker(arrows[1], occupancy, 5);
  assert.equal(blockerFor1, -1, 'Arrow 1 should be completely free');
});

test('rules: getFreeArrows correctly identifies free arrows in board', () => {
  const arrows: ArrowData[] = [
    { id: 0, c: [0, 1], d: 0 },
    { id: 1, c: [3], d: 1 },
    { id: 2, c: [24], d: 0 }, // free off right edge
  ];
  const occupancy = buildOccupancyMap(arrows, 5);
  const free = getFreeArrows(arrows, occupancy, 5, () => true);

  assert.deepEqual(free.sort(), [1, 2]);
});

test('rules: calculateStars calculates 3 stars for flawless play within par', () => {
  assert.equal(calculateStars(0, 4, 4), 3);
  assert.equal(calculateStars(0, 5, 4), 3);
  assert.equal(calculateStars(1, 4, 4), 2);
  assert.equal(calculateStars(2, 4, 4), 1);
});

test('rules: calculateCoinReward awards combo and first clear bonuses', () => {
  const firstClearCoins = calculateCoinReward(3, true, 4);
  assert.equal(firstClearCoins, 3 * 15 + 25 + 20); // 45 + 25 + 20 = 90

  const replayCoins = calculateCoinReward(2, false, 1);
  assert.equal(replayCoins, 30);
});

test('rules: pointToSegmentDistance computes accurate orthogonal distance', () => {
  // Line from (0, 0) to (4, 0). Point at (2, 1) -> distance is 1.0
  const dist = pointToSegmentDistance(2, 1, 0, 0, 4, 0);
  assert.ok(Math.abs(dist - 1.0) < 1e-6);

  // Point beyond endpoint (5, 0) -> distance to (4, 0) is 1.0
  const distBeyond = pointToSegmentDistance(5, 0, 0, 0, 4, 0);
  assert.ok(Math.abs(distBeyond - 1.0) < 1e-6);
});
