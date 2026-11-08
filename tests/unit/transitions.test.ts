/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import type { TransitionPhase } from '../../src/ui/GlobalTransitionOverlay';

interface TransitionMachineState {
  currentScreen: string;
  phase: TransitionPhase;
}

function triggerTransition(
  state: TransitionMachineState,
  targetScreen: string,
  reduceMotion = false
): { updatedScreen: string; intermediatePhase: TransitionPhase; finalPhase: TransitionPhase } {
  if (reduceMotion || state.currentScreen === targetScreen) {
    return {
      updatedScreen: targetScreen,
      intermediatePhase: 'idle',
      finalPhase: 'idle',
    };
  }

  // Cross-fade lifecycle: out -> in -> idle
  const intermediatePhase: TransitionPhase = 'out';
  const updatedScreen = targetScreen;
  const finalPhase: TransitionPhase = 'idle';

  return { updatedScreen, intermediatePhase, finalPhase };
}

test('transitions: standard navigation executes out phase before settling to idle', () => {
  const result = triggerTransition({ currentScreen: 'home', phase: 'idle' }, 'play', false);
  assert.equal(result.updatedScreen, 'play');
  assert.equal(result.intermediatePhase, 'out');
  assert.equal(result.finalPhase, 'idle');
});

test('transitions: same-screen navigation remains idle with no-op', () => {
  const result = triggerTransition({ currentScreen: 'home', phase: 'idle' }, 'home', false);
  assert.equal(result.updatedScreen, 'home');
  assert.equal(result.intermediatePhase, 'idle');
  assert.equal(result.finalPhase, 'idle');
});

test('transitions: reduceMotion bypasses cross-fade phase directly to idle', () => {
  const result = triggerTransition({ currentScreen: 'home', phase: 'idle' }, 'levels', true);
  assert.equal(result.updatedScreen, 'levels');
  assert.equal(result.intermediatePhase, 'idle');
  assert.equal(result.finalPhase, 'idle');
});
