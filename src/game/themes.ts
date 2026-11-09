/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ThemeColors, ThemeId } from './types';

export const THEMES: readonly ThemeColors[] = [
  {
    id: 0,
    name: 'Arrows Editorial',
    bg: '#f4efe6',
    line: '#1f2421',
    drop: '#266b62',
    accent: '#cca053',
    cardBg: '#fdfaf4',
  },
  {
    id: 1,
    name: 'Mint Oasis',
    bg: '#d6f2df',
    line: '#28503f',
    drop: '#1aa3a7',
    accent: '#47b385',
    cardBg: '#e8f7ee',
  },
  {
    id: 2,
    name: 'Midnight Slate',
    bg: '#1c242d',
    line: '#9fb0cb',
    drop: '#3d5af1',
    accent: '#5e7ce2',
    cardBg: '#252f3b',
  },
  {
    id: 3,
    name: 'Lavender Dusk',
    bg: '#ece6f7',
    line: '#4b3a7a',
    drop: '#e0589a',
    accent: '#9d7ad2',
    cardBg: '#f6f2fc',
  },
  {
    id: 4,
    name: 'Autumn Ember',
    bg: '#fbf0e8',
    line: '#7c3520',
    drop: '#ea6e36',
    accent: '#d9532f',
    cardBg: '#fef7f2',
  },
  {
    id: 5,
    name: 'Forest Moss',
    bg: '#e4eedb',
    line: '#264a2c',
    drop: '#439d5e',
    accent: '#5da845',
    cardBg: '#edf4e7',
  },
  {
    id: 6,
    name: 'Ocean Depths',
    bg: '#16232f',
    line: '#7cb5d8',
    drop: '#29c6db',
    accent: '#38a3c9',
    cardBg: '#1f3040',
  },
  {
    id: 7,
    name: 'Monochrome Ink',
    bg: '#f8f8f8',
    line: '#1c1c1c',
    drop: '#4a4a4a',
    accent: '#000000',
    cardBg: '#ffffff',
  },
  {
    id: 8,
    name: 'Forest Charcoal',
    bg: '#181e1c',
    line: '#e8efe9',
    drop: '#38a89d',
    accent: '#dca858',
    cardBg: '#222926',
  },
] as const;

export function getTheme(id: ThemeId): ThemeColors {
  return THEMES[id] || THEMES[0];
}

/**
 * Calculates WCAG 2.1 relative luminance for contrast verification.
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates WCAG contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Validates that all themes exceed minimum WCAG AA contrast ratio of 4.5:1.
 */
export function validateAllThemeContrasts(): boolean {
  for (const theme of THEMES) {
    const ratio = getContrastRatio(theme.bg, theme.line);
    if (ratio < 4.5) {
      console.warn(`Theme ${theme.name} has low contrast ratio: ${ratio.toFixed(2)}`);
      return false;
    }
  }
  return true;
}

/**
 * Determines whether a theme has a light background.
 * For light themes, text across the UI adapts to the theme's dark line color.
 */
export function isThemeLight(theme: ThemeColors): boolean {
  if (theme.bg.startsWith('rgba') || theme.bg.startsWith('rgb')) {
    return false;
  }
  return getLuminance(theme.bg) > 0.35;
}
