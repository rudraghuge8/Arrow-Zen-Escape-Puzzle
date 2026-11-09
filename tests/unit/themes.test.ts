/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { THEMES, validateAllThemeContrasts, getContrastRatio, isThemeLight } from '../../src/game/themes';

test('themes: all 9 themes meet WCAG AA contrast ratio (>= 4.5:1) for readability', () => {
  assert.equal(THEMES.length, 9, 'Must have 9 themes');
  for (const theme of THEMES) {
    const ratio = getContrastRatio(theme.bg, theme.line);
    assert.ok(
      ratio >= 4.5,
      `Theme ${theme.name} contrast ratio ${ratio.toFixed(2)} must be >= 4.5`
    );
  }
  assert.equal(validateAllThemeContrasts(), true);
});

test('themes: isThemeLight correctly classifies light vs dark themes', () => {
  const editorial = THEMES.find((t) => t.id === 0)!;
  const mint = THEMES.find((t) => t.id === 1)!;
  const slate = THEMES.find((t) => t.id === 2)!;
  const darkForest = THEMES.find((t) => t.id === 8)!;

  assert.equal(isThemeLight(editorial), true, 'Arrows Editorial is a light theme');
  assert.equal(isThemeLight(mint), true, 'Mint Oasis is a light theme');
  assert.equal(isThemeLight(slate), false, 'Midnight Slate is a dark theme');
  assert.equal(isThemeLight(darkForest), false, 'Forest Charcoal is a dark theme');
});
