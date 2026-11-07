/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { solveLevel } from '../src/game/solver';
import { findBlocker, buildOccupancyMap, calculateStars } from '../src/game/rules';
import type { CompactLevelData, ArrowData } from '../src/game/types';

test('bot playtest: all 500 pre-generated levels can be successfully solved through UI simulation', () => {
  const packsDir = path.resolve(process.cwd(), 'public/levels');
  let totalTested = 0;
  let maxPar = 0;
  let minPar = 999;
  let totalPar = 0;

  for (let packNum = 1; packNum <= 10; packNum++) {
    const packFile = path.join(packsDir, `pack-${packNum}.json`);
    assert.ok(fs.existsSync(packFile), `Level pack ${packNum} must exist on disk`);

    const raw = fs.readFileSync(packFile, 'utf8');
    const pack: CompactLevelData[] = JSON.parse(raw);
    assert.equal(pack.length, 50, `Pack ${packNum} must have 50 levels`);

    for (const compact of pack) {
      totalTested++;
      const arrows: ArrowData[] = compact.a.map((arr, idx) => ({
        id: idx,
        c: arr[0],
        d: arr[1],
      }));

      // 1. Solver verification
      const solverResult = solveLevel(arrows, compact.n);
      assert.equal(
        solverResult.solvable,
        true,
        `Level ${compact.l} in pack ${packNum} must be solvable!`
      );
      assert.ok(solverResult.par > 0, `Level ${compact.l} must have positive par`);

      // 2. Simulated UI Bot Playtest (simulates step-by-step player taps)
      const occupancy = buildOccupancyMap(arrows, compact.n);
      const isGone = new Uint8Array(arrows.length);
      let remaining = arrows.length;
      let botMoves = 0;

      while (remaining > 0) {
        // Bot looks for a free arrow (as player would)
        let chosenArrowId = -1;
        for (let i = 0; i < arrows.length; i++) {
          if (!isGone[i] && findBlocker(arrows[i], occupancy, compact.n) < 0) {
            chosenArrowId = i;
            break;
          }
        }

        assert.ok(
          chosenArrowId >= 0,
          `Bot got stuck on level ${compact.l} with ${remaining} arrows remaining!`
        );

        // Tap the free arrow: arrow slides out, occupancy freed
        isGone[chosenArrowId] = 1;
        remaining--;
        botMoves++;
        for (const cell of arrows[chosenArrowId].c) {
          occupancy[cell] = -1;
        }
      }

      assert.equal(remaining, 0, `Level ${compact.l} should be fully cleared by bot`);

      // 3. Check star rating feasibility
      const stars = calculateStars(0, botMoves, solverResult.par);
      assert.ok(stars >= 2, `Optimal bot play on level ${compact.l} must earn >= 2 stars`);

      // Track par statistics
      maxPar = Math.max(maxPar, solverResult.par);
      minPar = Math.min(minPar, solverResult.par);
      totalPar += solverResult.par;
    }
  }

  assert.equal(totalTested, 500, 'Must have successfully verified all 500 levels');
  console.log(`Bot playtest passed: 500/500 levels cleared! Par range: [${minPar}, ${maxPar}], Avg Par: ${(totalPar / 500).toFixed(1)}`);
});
