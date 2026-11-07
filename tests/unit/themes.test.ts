/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { THEMES, validateAllThemeContrasts, getContrastRatio } from '../../src/game/themes';

test('themes: all 8 themes meet WCAG AA contrast ratio (>= 4.5:1) for readability', () => {
  assert.equal(THEMES.length, 8, 'Must have at least 8 themes');
  for (const theme of THEMES) {
    const ratio = getContrastRatio(theme.bg, theme.line);
    assert.ok(
      ratio >= 4.5,
      `Theme ${theme.name} contrast ratio ${ratio.toFixed(2)} must be >= 4.5`
    );
  }
  assert.equal(validateAllThemeContrasts(), true);
});
