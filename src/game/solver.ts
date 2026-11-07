/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIRECTIONS, type ArrowData, type SolverResult } from './types';
import { findBlocker, buildOccupancyMap } from './rules';

/**
 * Solves an arrow puzzle and returns par (minimal batches) and difficulty metrics.
 * Uses wave simulation: in each round, all arrows whose paths are completely clear are cleared.
 */
export function solveLevel(
  arrows: ArrowData[],
  gridSize: number
): SolverResult {
  const totalArrows = arrows.length;
  if (totalArrows === 0) {
    return {
      solvable: true,
      par: 0,
      steps: [],
      difficultyScore: 0,
      totalArrows: 0,
      avgArrowLength: 0,
      initialFreeCount: 0,
    };
  }

  const occupancy = buildOccupancyMap(arrows, gridSize);
  const isAlive = new Uint8Array(totalArrows).fill(1);
  let remainingCount = totalArrows;
  let rounds = 0;
  let initialFreeCount = 0;
  const steps: number[] = [];
  let totalLength = 0;
  for (const a of arrows) {
    totalLength += a.c.length;
  }
  const avgArrowLength = totalLength / totalArrows;

  while (remainingCount > 0) {
    const wave: number[] = [];
    for (let i = 0; i < totalArrows; i++) {
      if (!isAlive[i]) continue;
      const arrow = arrows[i];
      if (findBlocker(arrow, occupancy, gridSize) < 0) {
        wave.push(i);
      }
    }

    if (rounds === 0) {
      initialFreeCount = wave.length;
    }

    // If no arrows are free to escape but some remain, the level is deadlocked / unsolvable!
    if (wave.length === 0) {
      return {
        solvable: false,
        par: -1,
        steps,
        difficultyScore: 9999,
        totalArrows,
        avgArrowLength,
        initialFreeCount,
      };
    }

    // Clear all free arrows in this wave
    for (const arrowId of wave) {
      isAlive[arrowId] = 0;
      remainingCount--;
      steps.push(arrowId);
      for (const cell of arrows[arrowId].c) {
        occupancy[cell] = -1;
      }
    }

    rounds++;
  }

  // Difficulty metric calculation:
  // - High par (chain depth) adds difficulty
  // - Low initial free ratio adds difficulty (requires specific opening)
  // - Higher average length increases inter-locking
  const initialFreeRatio = initialFreeCount / totalArrows;
  const difficultyScore = Math.round(
    rounds * 14 +
      (1 - initialFreeRatio) * 60 +
      avgArrowLength * 3 +
      totalArrows * 0.8
  );

  return {
    solvable: true,
    par: rounds,
    steps,
    difficultyScore,
    totalArrows,
    avgArrowLength: Math.round(avgArrowLength * 10) / 10,
    initialFreeCount,
  };
}
