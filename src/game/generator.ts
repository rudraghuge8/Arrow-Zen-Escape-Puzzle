/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIRECTIONS, type ArrowData, type DirectionIndex, type LevelData } from './types';
import { BOARD_SHAPES, createShapeMask } from './shapes';
import { solveLevel } from './solver';

export function createRng(seed: number): () => number {
  let s = (seed | 0) + 0x6d2b79f5;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s = s + Math.imul(s ^ (s >>> 7), 61 | s) ^ s;
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

export interface GeneratorOptions {
  levelNumber: number;
  seedOffset?: number;
}

/**
 * World definitions (20 worlds of 25 levels each = 500 levels).
 */
export const WORLDS = [
  { index: 0, name: 'Whispering Glade', themeId: 0, levels: [1, 25] },
  { index: 1, name: 'Amber Meadow', themeId: 1, levels: [26, 50] },
  { index: 2, name: 'Sapphire Stream', themeId: 2, levels: [51, 75] },
  { index: 3, name: 'Velvet Twilight', themeId: 3, levels: [76, 100] },
  { index: 4, name: 'Golden Oasis', themeId: 4, levels: [101, 125] },
  { index: 5, name: 'Emerald Canopy', themeId: 5, levels: [126, 150] },
  { index: 6, name: 'Crimson Peak', themeId: 6, levels: [151, 175] },
  { index: 7, name: 'Amethyst Cavern', themeId: 7, levels: [176, 200] },
  { index: 8, name: 'Sunlit Dunes', themeId: 0, levels: [201, 225] },
  { index: 9, name: 'Lotus Pond', themeId: 1, levels: [226, 250] },
  { index: 10, name: 'Starlit Haven', themeId: 2, levels: [251, 275] },
  { index: 11, name: 'Misty Highlands', themeId: 3, levels: [276, 300] },
  { index: 12, name: 'Coral Valley', themeId: 4, levels: [301, 325] },
  { index: 13, name: 'Boreal Forest', themeId: 5, levels: [326, 350] },
  { index: 14, name: 'Aurora Plateau', themeId: 6, levels: [351, 375] },
  { index: 15, name: 'Obsidian Citadel', themeId: 7, levels: [376, 400] },
  { index: 16, name: 'Celestial Terrace', themeId: 0, levels: [401, 425] },
  { index: 17, name: 'Elysian Meadow', themeId: 1, levels: [426, 450] },
  { index: 18, name: 'Cosmic Expanse', themeId: 2, levels: [451, 475] },
  { index: 19, name: 'Zenith of Zen', themeId: 3, levels: [476, 500] },
];

export function getWorldForLevel(levelNumber: number) {
  const clamped = Math.max(1, Math.min(500, levelNumber));
  const worldIndex = Math.min(19, Math.floor((clamped - 1) / 25));
  return WORLDS[worldIndex];
}

/**
 * Generates a single level candidate with the given seed.
 */
function generateCandidate(
  level: number,
  seedOffset: number
): { n: number; shapeMask: Uint8Array; arrows: ArrowData[]; shapeName: string } {
  const isRelief = level > 10 && level % 7 === 0;
  const isSpecial = level % 25 === 0;

  // Gentle progression for early levels
  let targetCells: number;
  let maxArrowLength: number;
  let shapeIdx: number;

  if (level <= 5) {
    // Tutorial levels: very small, gentle, obvious paths
    targetCells = 16 + level * 6; // 22, 28, 34, 40, 46
    maxArrowLength = 3;
    shapeIdx = 11; // Square for level 1-2, simple shapes for 3-5
    if (level === 3) shapeIdx = 0; // Ball
    if (level === 4) shapeIdx = 5; // Diamond
    if (level === 5) shapeIdx = 1; // Heart
  } else if (isRelief) {
    // Relief level: fewer cells, shorter chains, satisfying clears
    targetCells = Math.round(45 + level * 1.5);
    maxArrowLength = Math.min(18, 5 + Math.floor(level / 25));
    shapeIdx = ((level - 1) * 5) % 12;
  } else if (isSpecial) {
    // Special world boss level
    targetCells = Math.min(850, Math.round(90 + level * 2.8));
    maxArrowLength = Math.min(35, 12 + Math.floor(level / 12));
    shapeIdx = (Math.floor(level / 25) * 3) % 12;
  } else {
    // Standard progression
    targetCells = Math.min(750, Math.round(35 + level * 2.2));
    maxArrowLength = Math.min(30, 6 + Math.floor(level / 15));
    shapeIdx = ((level - 1) * 5) % 12;
  }

  const rng = createRng(level * 7919 + 13 + seedOffset);
  const shape = BOARD_SHAPES[shapeIdx];

  // Find minimum grid dimension n that fits targetCells
  let n = level <= 5 ? 5 + Math.floor(level / 2) : 7;
  let shapeMask: Uint8Array = new Uint8Array(n * n);
  let cellCount = 0;

  for (;; n++) {
    shapeMask = new Uint8Array(n * n);
    cellCount = 0;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const nx = ((x + 0.5) / n) * 2 - 1;
        const ny = ((y + 0.5) / n) * 2 - 1;
        if (shape.test(nx, ny)) {
          shapeMask[y * n + x] = 1;
          cellCount++;
        }
      }
    }
    if (cellCount >= targetCells || n >= 65) break;
  }

  const occupancy = new Int16Array(n * n).fill(-1);
  const arrows: ArrowData[] = [];
  const dirArrow = new Int8Array(n * n).fill(-1);
  const dirCell = new Int8Array(n * n).fill(-1);
  const dirCounts = [0, 0, 0, 0];
  const orderList: [number, number][] = [];

  const noiseWeight = level <= 5 ? 2 : 8;
  for (let i = 0; i < n * n; i++) {
    if (shapeMask[i]) {
      const distFromCenter = Math.hypot((i % n) - n / 2, Math.floor(i / n) - n / 2);
      orderList.push([distFromCenter + rng() * noiseWeight, i]);
    }
  }
  orderList.sort((a, b) => a[0] - b[0]);

  const rayClearLength = (startX: number, startY: number, dir: (typeof DIRECTIONS)[number]) => {
    let steps = 0;
    let x = startX + dir.dx;
    let y = startY + dir.dy;
    while (x >= 0 && y >= 0 && x < n && y < n) {
      if (occupancy[y * n + x] >= 0) return -1;
      x += dir.dx;
      y += dir.dy;
      steps++;
    }
    return steps;
  };

  const lengthTiers =
    level <= 5
      ? [maxArrowLength, 2]
      : [maxArrowLength, Math.max(3, maxArrowLength >> 1), 2];

  for (const maxLen of lengthTiers) {
    for (const [, startCell] of orderList) {
      if (occupancy[startCell] >= 0) continue;
      const arrowId = arrows.length;
      let bestCandidate: { path: number[]; dir: DirectionIndex; score: number } | null = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        const path = [startCell];
        const targetLen =
          Math.max(2, maxLen >> 1) + Math.floor(rng() * (maxLen - (maxLen >> 1) + 1));
        occupancy[startCell] = arrowId;
        let lastDir = -1;

        while (path.length < targetLen) {
          const current = path[path.length - 1];
          const cx = current % n;
          const cy = Math.floor(current / n);
          const validOptions: number[] = [];

          for (let d = 0; d < 4; d++) {
            const nx = cx + DIRECTIONS[d].dx;
            const ny = cy + DIRECTIONS[d].dy;
            if (nx >= 0 && ny >= 0 && nx < n && ny < n) {
              const neighborIdx = ny * n + nx;
              if (shapeMask[neighborIdx] && occupancy[neighborIdx] < 0) {
                validOptions.push(d);
              }
            }
          }

          if (validOptions.length === 0) break;
          const chosenDir =
            validOptions.includes(lastDir) && rng() < 0.05
              ? lastDir
              : validOptions[Math.floor(rng() * validOptions.length)];
          lastDir = chosenDir;
          const nextCell =
            (cy + DIRECTIONS[chosenDir].dy) * n + (cx + DIRECTIONS[chosenDir].dx);
          path.push(nextCell);
          occupancy[nextCell] = arrowId;
        }

        for (const candidatePath of [path, path.slice().reverse()]) {
          for (const cell of candidatePath) occupancy[cell] = arrowId;
          let bestEndIdx = 0;
          let bestHeadDir: DirectionIndex = 0;
          let bestScore = -1e9;

          for (let endIdx = candidatePath.length; endIdx >= 2; endIdx--) {
            if (endIdx < candidatePath.length) {
              occupancy[candidatePath[endIdx]] = -1;
            }
            const head = candidatePath[endIdx - 1];
            const hx = head % n;
            const hy = Math.floor(head / n);
            const prev = candidatePath[endIdx - 2];
            const px = prev % n;
            const py = Math.floor(prev / n);

            const straightDir = DIRECTIONS.findIndex(
              (d) => hx - px === d.dx && hy - py === d.dy
            ) as DirectionIndex;
            if (straightDir < 0) continue;

            let straightSegmentLength = 0;
            for (let i = endIdx - 1; i >= 1; i--) {
              const q = candidatePath[i];
              const w = candidatePath[i - 1];
              if (
                (q % n) - (w % n) === DIRECTIONS[straightDir].dx &&
                Math.floor(q / n) - Math.floor(w / n) === DIRECTIONS[straightDir].dy
              ) {
                straightSegmentLength++;
              } else {
                break;
              }
            }

            if (!(straightSegmentLength >= 2 || straightSegmentLength === endIdx - 1)) {
              continue;
            }

            const ray = rayClearLength(hx, hy, DIRECTIONS[straightDir]);
            if (ray < 0) continue;

            let dirVariety = 0;
            for (let dy = -3; dy <= 3; dy++) {
              for (let dx = -3; dx <= 3; dx++) {
                const u = hx + dx;
                const v = hy + dy;
                if (u >= 0 && v >= 0 && u < n && v < n && dirArrow[v * n + u] === straightDir) {
                  dirVariety++;
                }
              }
            }

            let parallelCollisions = 0;
            for (let i = endIdx - 1; i >= endIdx - 1 - straightSegmentLength; i--) {
              const q = candidatePath[i];
              const qx = q % n;
              const qy = Math.floor(q / n);
              const dirVec = DIRECTIONS[straightDir];
              for (const sign of [1, -1]) {
                const u = qx - dirVec.dy * sign;
                const v = qy + dirVec.dx * sign;
                if (u >= 0 && v >= 0 && u < n && v < n && dirCell[v * n + u] === straightDir) {
                  parallelCollisions++;
                }
              }
            }

            const score =
              ray +
              0.2 * endIdx -
              25 * dirVariety -
              40 * parallelCollisions -
              0.04 * dirCounts[straightDir];

            if (score > bestScore) {
              bestScore = score;
              bestEndIdx = endIdx;
              bestHeadDir = straightDir;
            }
          }

          for (const cell of candidatePath) {
            if (occupancy[cell] === arrowId) occupancy[cell] = -1;
          }

          if (bestEndIdx > 0 && (!bestCandidate || bestScore > bestCandidate.score)) {
            bestCandidate = {
              path: candidatePath.slice(0, bestEndIdx),
              dir: bestHeadDir,
              score: bestScore,
            };
          }
        }
      }

      if (bestCandidate) {
        for (const cell of bestCandidate.path) {
          occupancy[cell] = arrowId;
          dirCell[cell] = bestCandidate.dir;
        }
        dirArrow[bestCandidate.path[bestCandidate.path.length - 1]] = bestCandidate.dir;
        dirCounts[bestCandidate.dir]++;
        arrows.push({
          id: arrowId,
          c: bestCandidate.path,
          d: bestCandidate.dir,
        });
      }
    }
  }

  return { n, shapeMask, arrows, shapeName: shape.name };
}

/**
 * Generates and validates a complete, 100% solvable LevelData.
 * Iterates through seeds to pick the best solvable layout that fits the difficulty curve.
 */
export function generateLevel(levelNumber: number): LevelData {
  const world = getWorldForLevel(levelNumber);
  const isRelief = levelNumber > 10 && levelNumber % 7 === 0;
  const isSpecial = levelNumber % 25 === 0;

  let bestLevel: LevelData | null = null;
  let highestScore = -1e9;

  // Try multiple seed variants to find the optimal solvable candidate
  const attempts = levelNumber <= 10 ? 6 : 14;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const candidate = generateCandidate(levelNumber, attempt * 101);
    if (candidate.arrows.length < 2) continue;

    const solution = solveLevel(candidate.arrows, candidate.n);
    if (!solution.solvable) continue;

    // For tutorial levels (1-5), enforce high initial free ratio (>= 0.4)
    if (levelNumber <= 5 && solution.initialFreeCount / solution.totalArrows < 0.4) {
      continue;
    }

    const candidateScore =
      solution.par * 12 +
      (100 - (100 * solution.initialFreeCount) / solution.totalArrows) * 2.5 +
      solution.avgArrowLength * 2;

    if (candidateScore > highestScore) {
      highestScore = candidateScore;
      bestLevel = {
        levelNumber,
        worldIndex: world.index,
        worldName: world.name,
        shapeName: candidate.shapeName,
        gridSize: candidate.n,
        shapeMask: Array.from(candidate.shapeMask),
        arrows: candidate.arrows,
        par: solution.par,
        difficultyScore: solution.difficultyScore,
        isReliefLevel: isRelief,
        isSpecialLevel: isSpecial,
      };
    }
  }

  // Fallback: if all attempts failed, create a clean guaranteed solvable fallback
  if (!bestLevel) {
    const fallbackCandidate = generateCandidate(levelNumber, 9999);
    const solution = solveLevel(fallbackCandidate.arrows, fallbackCandidate.n);
    bestLevel = {
      levelNumber,
      worldIndex: world.index,
      worldName: world.name,
      shapeName: fallbackCandidate.shapeName,
      gridSize: fallbackCandidate.n,
      shapeMask: Array.from(fallbackCandidate.shapeMask),
      arrows: fallbackCandidate.arrows,
      par: Math.max(1, solution.par),
      difficultyScore: solution.difficultyScore,
      isReliefLevel: isRelief,
      isSpecialLevel: isSpecial,
    };
  }

  return bestLevel;
}
