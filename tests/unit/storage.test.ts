/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_STORAGE_DATA } from '../../src/storage/schema';

test('storage: default storage data has valid initial economy and boosters', () => {
  assert.equal(DEFAULT_STORAGE_DATA.version, 2);
  assert.equal(DEFAULT_STORAGE_DATA.unlockedLevel, 1);
  assert.equal(DEFAULT_STORAGE_DATA.coins, 100);
  assert.equal(DEFAULT_STORAGE_DATA.boosters.bomb, 2);
  assert.equal(DEFAULT_STORAGE_DATA.boosters.xray, 3);
  assert.equal(DEFAULT_STORAGE_DATA.boosters.extraDrop, 2);
  assert.equal(DEFAULT_STORAGE_DATA.hintsRemaining, 3);
  assert.equal(DEFAULT_STORAGE_DATA.voiceEnabled, false); // Voice off by default as required
  assert.equal(DEFAULT_STORAGE_DATA.language, 'en');
});
