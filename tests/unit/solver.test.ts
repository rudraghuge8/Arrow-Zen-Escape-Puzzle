/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { solveLevel } from '../../src/game/solver';
import type { ArrowData } from '../../src/game/types';

test('solver: detects simple 2-arrow dependency and calculates 2 waves (par)', () => {
  // Arrow 0: head at (0, 0), direction Right (0). Blocked by Arrow 1 at (2, 0).
  // Arrow 1: head at (2, 0), direction Down (1). Path Down is clear.
  const arrows: ArrowData[] = [
    { id: 0, c: [0], d: 0 },
    { id: 1, c: [2], d: 1 },
  ];
  const result = solveLevel(arrows, 4);

  assert.equal(result.solvable, true);
  assert.equal(result.par, 2);
  assert.deepEqual(result.steps, [1, 0]);
  assert.ok(result.difficultyScore > 0);
});

test('solver: flags circular deadlock cycle as unsolvable', () => {
  // 4 arrows facing each other in a circle, each blocking the next:
  // Arrow 0 at (0,0) facing Right (0) -> blocked by Arrow 1 at (1,0)
  // Arrow 1 at (1,0) facing Down (1) -> blocked by Arrow 2 at (1,1)
  // Arrow 2 at (1,1) facing Left (2) -> blocked by Arrow 3 at (0,1)
  // Arrow 3 at (0,1) facing Up (3) -> blocked by Arrow 0 at (0,0)
  const deadlockedArrows: ArrowData[] = [
    { id: 0, c: [0], d: 0 }, // (0,0) -> (1,0)
    { id: 1, c: [1], d: 1 }, // (1,0) -> (1,1)
    { id: 2, c: [5], d: 2 }, // (1,1) -> (0,1) in 4x4
    { id: 3, c: [4], d: 3 }, // (0,1) -> (0,0) in 4x4
  ];

  const result = solveLevel(deadlockedArrows, 4);
  assert.equal(result.solvable, false, 'Circular interlocking arrows must be unsolvable');
  assert.equal(result.par, -1);
});

test('solver: handles empty puzzle gracefully', () => {
  const result = solveLevel([], 5);
  assert.equal(result.solvable, true);
  assert.equal(result.par, 0);
});
