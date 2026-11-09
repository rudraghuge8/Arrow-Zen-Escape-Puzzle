/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { soundEngine } from '../../src/audio/soundEngine';

test('audio: soundEngine handles fanfare SFX gracefully', () => {
  // Ensure fanfare can be called via playSfx and playFanfare without error
  assert.doesNotThrow(() => {
    soundEngine.playSfx('fanfare');
  });

  assert.doesNotThrow(() => {
    soundEngine.playFanfare();
  });
});

test('audio: soundEngine respects soundEnabled and volume controls', () => {
  soundEngine.setSoundEnabled(false);
  assert.equal(soundEngine.soundEnabled, false);

  assert.doesNotThrow(() => {
    soundEngine.playFanfare();
  });

  soundEngine.setSoundEnabled(true);
  assert.equal(soundEngine.soundEnabled, true);

  soundEngine.setMasterVolume(80);
  assert.equal(soundEngine.masterVolume, 0.8);
});
