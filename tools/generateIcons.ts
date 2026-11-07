/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';

const ICONS_DIR = path.resolve(process.cwd(), 'public/icons');
fs.mkdirSync(ICONS_DIR, { recursive: true });

// 1. High-resolution SVG App Icon
const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fbf3e8" />
      <stop offset="100%" stopColor="#e8d5be" />
    </linearGradient>
    <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#5cc0ff" />
      <stop offset="100%" stopColor="#1e82dc" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.22" />
    </filter>
  </defs>

  <!-- Warm Zen Canvas Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="#7b4b2f" stroke-width="4" stroke-opacity="0.2" />

  <!-- Flowing Zen Curved Arrows -->
  <g filter="url(#shadow)">
    <!-- Main looping arrow -->
    <path d="M 120,380 V 220 Q 120,130 210,130 H 360" fill="none" stroke="#6b4528" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 350,85 L 430,130 L 350,175 Z" fill="#6b4528" />

    <!-- Interlocking complementary arrow -->
    <path d="M 230,380 H 330 Q 390,380 390,320 V 270" fill="none" stroke="#c0773a" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 360,285 L 390,225 L 420,285 Z" fill="#c0773a" />
  </g>

  <!-- Droppy Mascot in Center -->
  <g transform="translate(196, 206) scale(1.2)" filter="url(#shadow)">
    <path d="M 50,8 C 50,8 18,52 18,72 A 32,32 0 0,0 82,72 C 82,52 50,8 50,8 Z" fill="url(#dropGrad)" stroke="#135ea5" stroke-width="4" />
    <path d="M 32,46 C 36,36 46,26 48,22" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.75" />
    <circle cx="36" cy="62" r="4" fill="#0b3863" />
    <circle cx="64" cy="62" r="4" fill="#0b3863" />
    <path d="M 44,72 Q 50,78 56,72" fill="none" stroke="#0b3863" stroke-width="3.5" stroke-linecap="round" />
  </g>
</svg>`;

fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), appIconSvg);
fs.writeFileSync(path.join(ICONS_DIR, 'icon-192.svg'), appIconSvg);
fs.writeFileSync(path.join(ICONS_DIR, 'icon-512.svg'), appIconSvg);
fs.writeFileSync(path.join(ICONS_DIR, 'favicon.svg'), appIconSvg);

// 2. Play Store Feature Graphic (1024x500)
const featureGraphicSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="bgGradF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f7ece0" />
      <stop offset="50%" stopColor="#ecdac4" />
      <stop offset="100%" stopColor="#dfc3a7" />
    </linearGradient>
    <linearGradient id="dropGradF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#64c9ff" />
      <stop offset="100%" stopColor="#258ae8" />
    </linearGradient>
    <filter id="shadowF">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <rect width="1024" height="500" fill="url(#bgGradF)" />

  <!-- Ambient background curves -->
  <path d="M -50,420 Q 200,300 450,440 T 1050,380" fill="none" stroke="#7b4b2f" stroke-width="6" opacity="0.12" />
  <path d="M -50,120 Q 300,240 600,100 T 1100,160" fill="none" stroke="#7b4b2f" stroke-width="6" opacity="0.12" />

  <!-- Left: Mascot Hero Lockup -->
  <g transform="translate(140, 90) scale(3.2)" filter="url(#shadowF)">
    <path d="M 50,8 C 50,8 18,52 18,72 A 32,32 0 0,0 82,72 C 82,52 50,8 50,8 Z" fill="url(#dropGradF)" stroke="#135ea5" stroke-width="3" />
    <path d="M 32,46 C 36,36 46,26 48,22" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.75" />
    <circle cx="36" cy="62" r="3.5" fill="#0b3863" />
    <circle cx="64" cy="62" r="3.5" fill="#0b3863" />
    <path d="M 44,71 Q 50,77 56,71" fill="none" stroke="#0b3863" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- Right: Title & Feature Tags -->
  <g transform="translate(480, 160)" fill="#6b4528">
    <text x="0" y="0" font-family="serif, system-ui" font-size="64" font-weight="900" letter-spacing="1">Arrow Zen</text>
    <text x="0" y="48" font-family="system-ui, sans-serif" font-size="28" font-weight="600" fill="#c0773a">Mindful Escape Puzzle</text>
    <text x="0" y="105" font-family="system-ui, sans-serif" font-size="19" opacity="0.8">500 Handcrafted Levels · 20 Beautiful Worlds</text>
    <text x="0" y="140" font-family="system-ui, sans-serif" font-size="19" opacity="0.8">Calm Ambient Music · 100% Offline Playable</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(ICONS_DIR, 'feature-graphic.svg'), featureGraphicSvg);

console.log('Successfully generated original SVG icons and Google Play Store feature graphic!');
