/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BoardShapeDefinition {
  name: string;
  test: (x: number, y: number) => boolean;
}

export const BOARD_SHAPES: readonly BoardShapeDefinition[] = [
  {
    name: 'Ball',
    test: (x, y) => x * x + y * y <= 1,
  },
  {
    name: 'Heart',
    test: (x, y) => {
      const px = x * 1.2;
      const py = -y * 1.2 + 0.15;
      return (px * px + py * py - 1) ** 3 - px * px * py ** 3 <= 0;
    },
  },
  {
    name: 'House',
    test: (x, y) => (y > -0.05 ? Math.abs(x) < 0.78 : y > -1 && Math.abs(x) <= (y + 1) * 1.05),
  },
  {
    name: 'Star',
    test: (x, y) =>
      Math.hypot(x, y) <=
      0.38 + 0.62 * Math.abs(Math.cos(2.5 * (Math.atan2(y, x) + 1.5708))) ** 1.5,
  },
  {
    name: 'Butterfly',
    test: (x, y) => {
      const a = Math.abs(x);
      return (
        (a < 0.09 && Math.abs(y) < 0.9) ||
        ((a - 0.55) / 0.45) ** 2 + ((y + 0.3) / 0.6) ** 2 <= 1 ||
        ((a - 0.42) / 0.4) ** 2 + ((y - 0.5) / 0.48) ** 2 <= 1
      );
    },
  },
  {
    name: 'Diamond',
    test: (x, y) => Math.abs(x) + Math.abs(y) <= 1,
  },
  {
    name: 'Trophy',
    test: (x, y) =>
      y < 0
        ? Math.abs(x) <= 0.9 - 0.5 * (y + 1)
        : y < 0.55
          ? Math.abs(x) < 0.16
          : Math.abs(x) < 0.6,
  },
  {
    name: 'Flower',
    test: (x, y) =>
      Math.hypot(x, y) <= 0.35 + 0.65 * Math.abs(Math.cos(3 * Math.atan2(y, x))),
  },
  {
    name: 'Hexagon',
    test: (x, y) => Math.abs(y) <= 0.87 && Math.abs(x) * 0.87 + Math.abs(y) * 0.5 <= 0.87,
  },
  {
    name: 'Cross',
    test: (x, y) => Math.min(Math.abs(x), Math.abs(y)) < 0.35,
  },
  {
    name: 'Triangle',
    test: (x, y) => Math.abs(x) <= (y + 1) / 2,
  },
  {
    name: 'Square',
    test: () => true,
  },
] as const;

/**
 * Builds a binary mask (Uint8Array) for a given board shape at resolution n x n.
 */
export function createShapeMask(shapeIndex: number, n: number): Uint8Array {
  const shape = BOARD_SHAPES[((shapeIndex % 12) + 12) % 12];
  const mask = new Uint8Array(n * n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const nx = ((x + 0.5) / n) * 2 - 1;
      const ny = ((y + 0.5) / n) * 2 - 1;
      if (shape.test(nx, ny)) {
        mask[y * n + x] = 1;
      }
    }
  }
  return mask;
}
