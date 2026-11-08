/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';

export function calculateCampaignProgress(unlockedLevel: number, totalLevels = 500) {
  const clamped = Math.max(1, Math.min(totalLevels, unlockedLevel));
  const percent = Math.min(100, Math.max(0.6, (clamped / totalLevels) * 100));
  return { clamped, percent };
}

test('hud: campaign progress correctly maps 500 levels and clamps within bounds', () => {
  const p1 = calculateCampaignProgress(1);
  assert.equal(p1.clamped, 1);
  assert.ok(Math.abs(p1.percent - 0.6) < 0.1 || Math.abs(p1.percent - 0.2) < 0.5);

  const pHalf = calculateCampaignProgress(250);
  assert.equal(pHalf.clamped, 250);
  assert.equal(pHalf.percent, 50);

  const pFull = calculateCampaignProgress(500);
  assert.equal(pFull.clamped, 500);
  assert.equal(pFull.percent, 100);

  const pOver = calculateCampaignProgress(999);
  assert.equal(pOver.clamped, 500);
  assert.equal(pOver.percent, 100);

  const pZero = calculateCampaignProgress(0);
  assert.equal(pZero.clamped, 1);
});
