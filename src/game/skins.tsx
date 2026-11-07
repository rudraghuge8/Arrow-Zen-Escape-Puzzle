/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { ArrowSkinId, DirectionIndex } from './types';

export interface SkinMeta {
  id: ArrowSkinId;
  name: string;
  tagline: string;
  desc: string;
  cost: number;
  accentColor: string;
  glowColor: string;
}

export const SKINS_CATALOG: SkinMeta[] = [
  {
    id: 'round',
    name: 'Zen Round',
    tagline: 'Classic & Calming',
    desc: 'Soft organic tubular curves with warm earthy gradients and smooth aerodynamic droplets.',
    cost: 0,
    accentColor: '#93582e',
    glowColor: 'rgba(147, 88, 46, 0.35)',
  },
  {
    id: 'sharp',
    name: 'Katana Sharp',
    tagline: 'Faceted & Precise',
    desc: 'Beveled geometric edges, razor-sharp chevron facets, and titanium metallic highlights.',
    cost: 150,
    accentColor: '#475569',
    glowColor: 'rgba(71, 85, 105, 0.45)',
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    tagline: 'Luminous & Electric',
    desc: 'Bioluminescent laser spine with neon cyan bloom, pulse rings, and synthwave energy.',
    cost: 300,
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
  },
  {
    id: 'pixel',
    name: 'Retro 8-Bit',
    tagline: 'Arcade Nostalgia',
    desc: 'Chunky pixelated mosaic blocks, stepped staircase contours, and retro arcade charm.',
    cost: 500,
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
  },
];

/**
 * Direction degree angles for SVG rotation
 */
export const DIRECTION_ANGLES: Record<DirectionIndex | string, number> = {
  0: 0,    // Right
  1: 90,   // Down
  2: 180,  // Left
  3: 270,  // Up
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export interface ArrowSkinSvgProps extends React.HTMLAttributes<HTMLDivElement> {
  skin: ArrowSkinId;
  size?: number;
  direction?: DirectionIndex | 'right' | 'down' | 'left' | 'up';
  animated?: boolean;
}

/**
 * 1. Zen Round Arrow SVG
 * Smooth cylindrical tube with ambient drop shadow, specular light spine, and aerodynamic droplet head.
 */
export const RoundArrowSvg: React.FC<{ size?: number; className?: string; animated?: boolean }> = ({
  size = 64,
  className = '',
  animated = false,
}) => (
  <svg
    viewBox="0 0 100 48"
    width={size}
    height={(size * 48) / 100}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="round-shadow" x="-10%" y="-20%" width="120%" height="150%">
        <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.25" />
      </filter>
      <linearGradient id="round-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b4784a" />
        <stop offset="50%" stopColor="#8d5127" />
        <stop offset="100%" stopColor="#673919" />
      </linearGradient>
      <linearGradient id="round-spine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0.7)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
      </linearGradient>
      <radialGradient id="round-head-grad" cx="40%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#c58a5c" />
        <stop offset="60%" stopColor="#8d5127" />
        <stop offset="100%" stopColor="#5a3114" />
      </radialGradient>
    </defs>

    {/* Drop shadow & Body shaft */}
    <g filter="url(#round-shadow)">
      {/* Cylindrical main shaft */}
      <path
        d="M 12 24 L 66 24"
        stroke="url(#round-body-grad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Soft beveled spine highlight */}
      <path
        d="M 14 21.5 L 64 21.5"
        stroke="url(#round-spine-grad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Embedded flowing chevrons */}
      <path
        d="M 28 20 L 33 24 L 28 28"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-pulse' : ''}
      />
      <path
        d="M 44 20 L 49 24 L 44 28"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-pulse' : ''}
      />

      {/* Aerodynamic Droplet Arrowhead */}
      <path
        d="M 62 10 Q 74 15 92 24 Q 74 33 62 38 Q 67 24 62 10 Z"
        fill="url(#round-head-grad)"
      />
      {/* Arrowhead center ridge highlight */}
      <path
        d="M 64 24 L 88 24"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

/**
 * 2. Katana Sharp Arrow SVG
 * Chiseled faceted steel shaft with razor chevron facets, metallic luster, and titanium edge highlight.
 */
export const SharpArrowSvg: React.FC<{ size?: number; className?: string; animated?: boolean }> = ({
  size = 64,
  className = '',
}) => (
  <svg
    viewBox="0 0 100 48"
    width={size}
    height={(size * 48) / 100}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="sharp-shadow" x="-10%" y="-20%" width="120%" height="150%">
        <feDropShadow dx="2" dy="3.5" stdDeviation="2" floodColor="#000" floodOpacity="0.32" />
      </filter>
      <linearGradient id="sharp-top-facet" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="60%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="sharp-bottom-facet" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="60%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="sharp-edge-glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#f8fafc" />
      </linearGradient>
    </defs>

    <g filter="url(#sharp-shadow)">
      {/* Top faceted half */}
      <polygon points="10,24 16,19 66,19 66,24" fill="url(#sharp-top-facet)" />
      {/* Bottom faceted half */}
      <polygon points="10,24 16,29 66,29 66,24" fill="url(#sharp-bottom-facet)" />

      {/* Razor center ridge */}
      <line x1="12" y1="24" x2="66" y2="24" stroke="url(#sharp-edge-glow)" strokeWidth="1.8" />

      {/* Geometric facet incisions */}
      <line x1="30" y1="20" x2="36" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <line x1="48" y1="20" x2="54" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

      {/* Chiseled Diamond Katana Arrowhead */}
      <polygon
        points="94,24 64,8 72,24 64,40"
        fill="url(#sharp-top-facet)"
        stroke="#1e293b"
        strokeWidth="1.2"
        strokeLinejoin="miter"
      />
      {/* Lower shaded head facet */}
      <polygon points="94,24 72,24 64,40" fill="url(#sharp-bottom-facet)" />
      {/* Razor blade tip specular reflection */}
      <polygon points="94,24 73,24 79,21" fill="url(#sharp-edge-glow)" />
    </g>
  </svg>
);

/**
 * 3. Cyber Neon Arrow SVG
 * Bioluminescent laser spine with electric cyan and hot magenta neon glow bloom.
 */
export const NeonArrowSvg: React.FC<{ size?: number; className?: string; animated?: boolean }> = ({
  size = 64,
  className = '',
  animated = false,
}) => (
  <svg
    viewBox="0 0 100 48"
    width={size}
    height={(size * 48) / 100}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="neon-glow" x="-20%" y="-30%" width="140%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="neon-core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>

    {/* Outer glow bloom halo */}
    <g filter="url(#neon-glow)">
      {/* Aura stroke */}
      <path
        d="M 12 24 L 66 24"
        stroke="#06b6d4"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.55"
      />
      <polygon
        points="92,24 63,11 70,24 63,37"
        fill="#0891b2"
        opacity="0.65"
      />
    </g>

    {/* Core laser beam */}
    <g>
      {/* Electric cyan main body */}
      <path
        d="M 12 24 L 66 24"
        stroke="url(#neon-core-grad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Hot white photon core spine */}
      <path
        d="M 14 24 L 65 24"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Cyber pulse chevrons */}
      <path
        d="M 28 19 L 34 24 L 28 29"
        stroke="#e0f2fe"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 44 19 L 50 24 L 44 29"
        stroke="#e0f2fe"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Neon Plasma Arrowhead */}
      <polygon
        points="93,24 64,12 71,24 64,36"
        fill="#06b6d4"
        stroke="#38bdf8"
        strokeWidth="1.8"
      />
      {/* White core tip */}
      <polygon
        points="91,24 74,21 73,24 74,27"
        fill="#ffffff"
      />
      {/* Energy pulse particle spark */}
      <circle cx="94" cy="24" r="2.5" fill="#ffffff" className={animated ? 'animate-ping' : ''} />
    </g>
  </svg>
);

/**
 * 4. Retro 8-Bit Pixel Arrow SVG
 * Chunky mosaic staircase contours with authentic arcade pixel art aesthetics.
 */
export const PixelArrowSvg: React.FC<{ size?: number; className?: string; animated?: boolean }> = ({
  size = 64,
  className = '',
}) => {
  // Unit pixel size: 4x4 on a 100x48 canvas
  return (
    <svg
      viewBox="0 0 100 48"
      width={size}
      height={(size * 48) / 100}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <defs>
        <filter id="pixel-shadow" x="-5%" y="-10%" width="115%" height="130%">
          <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#pixel-shadow)">
        {/* Pixel Arrow Body - Dark border / base */}
        <rect x="12" y="18" width="52" height="12" fill="#78350f" />
        {/* Main Amber Pixel Fill */}
        <rect x="14" y="20" width="48" height="8" fill="#d97706" />
        {/* Top Highlight Pixel Strip */}
        <rect x="14" y="20" width="48" height="3" fill="#fbbf24" />
        {/* Bottom Shade Pixel Strip */}
        <rect x="14" y="25" width="48" height="3" fill="#92400e" />

        {/* Interior Pixel Chevrons */}
        <rect x="28" y="22" width="3" height="4" fill="#fef3c7" />
        <rect x="31" y="23" width="3" height="2" fill="#fef3c7" />
        <rect x="44" y="22" width="3" height="4" fill="#fef3c7" />
        <rect x="47" y="23" width="3" height="2" fill="#fef3c7" />

        {/* Stepped Pixel Arrowhead */}
        {/* Outer dark border */}
        <path
          d="M 64 8 H 68 V 12 H 72 V 16 H 76 V 20 H 80 V 22 H 88 V 26 H 80 V 28 H 76 V 32 H 72 V 36 H 68 V 40 H 64 V 32 H 60 V 16 H 64 Z"
          fill="#451a03"
        />
        {/* Golden amber fill */}
        <path
          d="M 66 12 H 69 V 16 H 73 V 20 H 77 V 23 H 85 V 25 H 77 V 28 H 73 V 32 H 69 V 36 H 66 V 28 H 63 V 20 H 66 Z"
          fill="#f59e0b"
        />
        {/* Upper pixel specular highlight */}
        <path
          d="M 66 12 H 69 V 16 H 73 V 20 H 77 V 23 H 85 V 24 H 66 Z"
          fill="#fde68a"
        />
        {/* Pixel Tip */}
        <rect x="85" y="23" width="3" height="2" fill="#ffffff" />
      </g>
    </svg>
  );
};

/**
 * Unified ArrowSkinSvg Component
 * Renders the chosen stylized vector skin, rotated to match the desired direction.
 */
export const ArrowSkinSvg: React.FC<ArrowSkinSvgProps> = ({
  skin,
  size = 64,
  direction = 0,
  animated = false,
  className = '',
  style,
  ...rest
}) => {
  const rotation = DIRECTION_ANGLES[direction] ?? 0;

  const renderSkin = () => {
    switch (skin) {
      case 'sharp':
        return <SharpArrowSvg size={size} animated={animated} />;
      case 'neon':
        return <NeonArrowSvg size={size} animated={animated} />;
      case 'pixel':
        return <PixelArrowSvg size={size} animated={animated} />;
      case 'round':
      default:
        return <RoundArrowSvg size={size} animated={animated} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
      {...rest}
    >
      {renderSkin()}
    </div>
  );
};

/**
 * Canvas Arrowhead Helper
 * Harmonizes the HTML5 Canvas arrowhead rendering with the exact SVG skin aesthetics.
 */
export function renderCanvasSkinHead(
  ctx: CanvasRenderingContext2D,
  skin: ArrowSkinId,
  headSize: number,
  baseColor: string,
  highlightColor: string
) {
  ctx.save();

  if (skin === 'sharp') {
    // Chiseled Katana Diamond Head with faceted bevel lines
    ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2.5;

    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(headSize * 0.92, 0);
    ctx.lineTo(-headSize * 0.58, -headSize * 0.52);
    ctx.lineTo(-headSize * 0.25, 0);
    ctx.lineTo(-headSize * 0.58, headSize * 0.52);
    ctx.closePath();
    ctx.fill();

    // Specular upper facet
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = highlightColor;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(headSize * 0.92, 0);
    ctx.lineTo(-headSize * 0.58, -headSize * 0.52);
    ctx.lineTo(-headSize * 0.25, 0);
    ctx.closePath();
    ctx.fill();
  } else if (skin === 'pixel') {
    // Stepped 8-bit mosaic staircase head
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 2.5;
    ctx.shadowOffsetY = 2.5;

    const u = headSize * 0.25;
    ctx.fillStyle = baseColor;
    // Stepped staircase polygon
    ctx.beginPath();
    ctx.rect(u * 1.5, -u * 0.5, u, u);
    ctx.rect(u * 0.5, -u * 1.2, u, u * 2.4);
    ctx.rect(-u * 0.5, -u * 1.8, u, u * 3.6);
    ctx.rect(-u * 1.5, -u * 2.2, u, u * 4.4);
    ctx.fill();

    // Pixel highlight on top
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = highlightColor;
    ctx.globalAlpha = 0.65;
    ctx.fillRect(u * 1.5, -u * 0.5, u, u * 0.5);
    ctx.fillRect(u * 0.5, -u * 1.2, u, u * 0.5);
    ctx.fillRect(-u * 0.5, -u * 1.8, u, u * 0.5);
  } else if (skin === 'neon') {
    // Cyber Neon Plasma Head with luminous aura
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = headSize * 0.8;
    ctx.fillStyle = '#06b6d4';

    ctx.beginPath();
    ctx.moveTo(headSize * 0.9, 0);
    ctx.lineTo(-headSize * 0.5, -headSize * 0.46);
    ctx.lineTo(-headSize * 0.22, 0);
    ctx.lineTo(-headSize * 0.5, headSize * 0.46);
    ctx.closePath();
    ctx.fill();

    // Hot photon white core
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(headSize * 0.82, 0);
    ctx.lineTo(0, -headSize * 0.12);
    ctx.lineTo(-headSize * 0.15, 0);
    ctx.lineTo(0, headSize * 0.12);
    ctx.closePath();
    ctx.fill();
  } else {
    // Zen Round: Organic aerodynamic curved chevron
    ctx.shadowColor = 'rgba(0, 0, 0, 0.24)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1.5;
    ctx.shadowOffsetY = 2.5;

    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(headSize * 0.84, 0);
    ctx.quadraticCurveTo(0, -headSize * 0.12, -headSize * 0.5, -headSize * 0.48);
    ctx.lineTo(-headSize * 0.24, 0);
    ctx.lineTo(-headSize * 0.5, headSize * 0.48);
    ctx.quadraticCurveTo(0, headSize * 0.12, headSize * 0.84, 0);
    ctx.closePath();
    ctx.fill();

    // Center ridge highlight
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = highlightColor;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(headSize * 0.78, 0);
    ctx.lineTo(-headSize * 0.1, -headSize * 0.1);
    ctx.lineTo(-headSize * 0.2, 0);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
