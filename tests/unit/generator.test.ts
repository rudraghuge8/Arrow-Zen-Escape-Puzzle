/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateLevel, getWorldForLevel } from '../../src/game/generator';
import { solveLevel } from '../../src/game/solver';

test('generator: level 1 is gentle, solvable, and has par <= 3', () => {
  const level1 = generateLevel(1);
  assert.equal(level1.levelNumber, 1);
  assert.ok(level1.arrows.length >= 2, 'Level 1 must have at least 2 arrows');
  assert.ok(level1.gridSize <= 8, 'Level 1 must be small and gentle');

  const solution = solveLevel(level1.arrows, level1.gridSize);
  assert.equal(solution.solvable, true, 'Level 1 must be 100% solvable');
  assert.ok(solution.par <= 4, 'Level 1 par must be small');
});

test('generator: relief levels are flagged appropriately', () => {
  const level14 = generateLevel(14);
  assert.equal(level14.isReliefLevel, true);
});

test('generator: world boss levels are flagged appropriately', () => {
  const level25 = generateLevel(25);
  assert.equal(level25.isSpecialLevel, true);
});

test('generator: maps world index and names properly', () => {
  const w1 = getWorldForLevel(5);
  assert.equal(w1.name, 'Whispering Glade');
  assert.equal(w1.index, 0);

  const w2 = getWorldForLevel(30);
  assert.equal(w2.name, 'Amber Meadow');
  assert.equal(w2.index, 1);

  const wFinal = getWorldForLevel(500);
  assert.equal(wFinal.name, 'Zenith of Zen');
  assert.equal(wFinal.index, 19);
});
