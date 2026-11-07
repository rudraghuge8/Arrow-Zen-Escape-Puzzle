/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import type { ThemeColors } from '../game/types';

interface VictoryDropParticlesProps {
  theme?: ThemeColors;
  reduceMotion?: boolean;
}

interface DropParticle {
  id: number;
  startX: number; // percentage (0-100)
  startY: number; // percentage (0-100)
  tx: number; // px target translation X
  ty: number; // px target translation Y
  peakY: number; // px apex trajectory
  rot: number; // degrees
  scale: number;
  duration: number; // seconds
  delay: number; // seconds
  variant: 'mascot' | 'dew' | 'sparkle';
  size: number;
}

export const VictoryDropParticles: React.FC<VictoryDropParticlesProps> = ({
  theme,
  reduceMotion = false,
}) => {
  const dropColor = theme?.drop || '#38bdf8';
  const accentColor = theme?.accent || '#fbbf24';

  // Pre-generate 36 deterministic joyful particles upon mount
  const particles: DropParticle[] = useMemo(() => {
    const list: DropParticle[] = [];
    const count = reduceMotion ? 12 : 38;

    for (let i = 0; i < count; i++) {
      // 3 emitter sources: Left Cannon (0-12), Right Cannon (13-25), Center Radial Burst (26-37)
      let startX: number;
      let startY: number;
      let tx: number;
      let ty: number;
      let peakY: number;

      if (i < 13) {
        // Left Cannon: launches up and across to the right
        startX = 12 + Math.random() * 8;
        startY = 85 + Math.random() * 10;
        const angle = -Math.PI * 0.42 + (Math.random() - 0.5) * 0.45;
        const distance = 260 + Math.random() * 220;
        tx = Math.cos(angle) * distance + (180 + Math.random() * 140);
        ty = Math.sin(angle) * distance;
        peakY = ty - (120 + Math.random() * 90);
      } else if (i < 26) {
        // Right Cannon: launches up and across to the left
        startX = 82 + Math.random() * 8;
        startY = 85 + Math.random() * 10;
        const angle = -Math.PI * 0.58 + (Math.random() - 0.5) * 0.45;
        const distance = 260 + Math.random() * 220;
        tx = Math.cos(angle) * distance - (180 + Math.random() * 140);
        ty = Math.sin(angle) * distance;
        peakY = ty - (120 + Math.random() * 90);
      } else {
        // Center Radial Burst: explodes outward 360 degrees
        startX = 50 + (Math.random() - 0.5) * 10;
        startY = 48 + (Math.random() - 0.5) * 10;
        const angle = Math.random() * Math.PI * 2;
        const distance = 160 + Math.random() * 220;
        tx = Math.cos(angle) * distance;
        ty = Math.sin(angle) * distance;
        peakY = ty - (60 + Math.random() * 60);
      }

      const variants: Array<'mascot' | 'dew' | 'sparkle'> = ['mascot', 'dew', 'sparkle'];
      const variant = variants[i % variants.length];

      list.push({
        id: i,
        startX,
        startY,
        tx,
        ty,
        peakY,
        rot: (Math.random() - 0.5) * 540,
        scale: 0.75 + Math.random() * 0.65,
        duration: 1.6 + Math.random() * 0.8,
        delay: Math.random() * 0.55,
        variant,
        size: Math.floor(24 + Math.random() * 18),
      });
    }

    return list;
  }, [reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none"
    >
      <style>{`
        @keyframes dropTrajectory {
          0% {
            transform: translate3d(0, 0, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 1;
            transform: translate3d(calc(var(--tx) * 0.25), var(--peaky), 0) scale(var(--scale)) rotate(calc(var(--rot) * 0.2));
          }
          45% {
            opacity: 1;
            transform: translate3d(calc(var(--tx) * 0.65), calc(var(--peaky) * 0.7 + var(--ty) * 0.3), 0) scale(calc(var(--scale) * 1.1)) rotate(calc(var(--rot) * 0.5));
          }
          75% {
            opacity: 0.9;
            transform: translate3d(var(--tx), var(--ty), 0) scale(var(--scale)) rotate(calc(var(--rot) * 0.85));
          }
          100% {
            opacity: 0;
            transform: translate3d(calc(var(--tx) * 1.15), calc(var(--ty) + 140px), 0) scale(0.35) rotate(var(--rot));
          }
        }

        @keyframes dropWobble {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.15, 0.88); }
        }

        .animate-drop-particle {
          animation: dropTrajectory var(--duration) cubic-bezier(0.22, 1, 0.36, 1) var(--delay) forwards;
          will-change: transform, opacity;
        }

        .animate-drop-wobble {
          animation: dropWobble 0.6s ease-in-out infinite;
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-drop-particle"
          style={
            {
              left: `${p.startX}%`,
              top: `${p.startY}%`,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--peaky': `${p.peakY}px`,
              '--rot': `${p.rot}deg`,
              '--scale': `${p.scale}`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="animate-drop-wobble">
            {p.variant === 'mascot' && (
              <JoyfulMascotDropSvg size={p.size} primaryColor={dropColor} accentColor={accentColor} />
            )}
            {p.variant === 'dew' && (
              <CrystallineDewDropSvg size={p.size} primaryColor={dropColor} />
            )}
            {p.variant === 'sparkle' && (
              <SparkleStarDropSvg size={p.size} primaryColor={dropColor} starColor={accentColor} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 1. Joyful Mascot Water Drop
 * Water droplet with adorable cheerful closed-eye smile `^ ^` and rosy cheeks
 */
const JoyfulMascotDropSvg: React.FC<{ size: number; primaryColor: string; accentColor: string }> = ({
  size,
  primaryColor,
  accentColor,
}) => (
  <svg
    viewBox="0 0 36 44"
    width={size}
    height={(size * 44) / 36}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: `drop-shadow(0 4px 8px ${primaryColor}66)` }}
  >
    <defs>
      <linearGradient id={`mascotDropGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="35%" stopColor={primaryColor} />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>

    {/* Teardrop Body */}
    <path
      d="M 18,3 C 18,3 5,19 5,27 A 13,13 0 0,0 31,27 C 31,19 18,3 18,3 Z"
      fill={`url(#mascotDropGrad-${size})`}
      stroke="#ffffff"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />

    {/* Specular curved glint */}
    <path
      d="M 11,20 C 9,24 10,29 13,31"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.85"
    />

    {/* Cheerful happy eyes: ^ ^ */}
    <path
      d="M 12,23 Q 14,20 16,23"
      stroke="#1e293b"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 20,23 Q 22,20 24,23"
      stroke="#1e293b"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Joyful open mouth smile */}
    <path
      d="M 16,27 Q 18,30 20,27"
      stroke="#1e293b"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="#f43f5e"
    />

    {/* Cute blushing cheeks */}
    <circle cx="10" cy="25" r="1.8" fill={accentColor} opacity="0.8" />
    <circle cx="26" cy="25" r="1.8" fill={accentColor} opacity="0.8" />
  </svg>
);

/**
 * 2. Crystalline Dew Drop
 * Deep liquid gradient with glass reflection bubble and crystal luster
 */
const CrystallineDewDropSvg: React.FC<{ size: number; primaryColor: string }> = ({
  size,
  primaryColor,
}) => (
  <svg
    viewBox="0 0 32 40"
    width={size}
    height={(size * 40) / 32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: `drop-shadow(0 3px 6px ${primaryColor}55)` }}
  >
    <defs>
      <linearGradient id={`dewGrad-${size}`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="40%" stopColor={primaryColor} />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
    </defs>

    {/* Clean Teardrop */}
    <path
      d="M 16,2 C 16,2 4,16 4,24 A 12,12 0 0,0 28,24 C 28,16 16,2 16,2 Z"
      fill={`url(#dewGrad-${size})`}
      stroke="#ffffff"
      strokeWidth="1.2"
    />

    {/* Top left glossy highlight */}
    <ellipse
      cx="11"
      cy="20"
      rx="3"
      ry="5.5"
      transform="rotate(-28 11 20)"
      fill="#ffffff"
      opacity="0.85"
    />

    {/* Bottom right subtle caustic reflection */}
    <path
      d="M 19,29 C 23,28 24,25 24,22"
      stroke="#bae6fd"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

/**
 * 3. Sparkle Star Water Drop
 * Drop with glittering golden mini-stars orbiting or embedded
 */
const SparkleStarDropSvg: React.FC<{ size: number; primaryColor: string; starColor: string }> = ({
  size,
  primaryColor,
  starColor,
}) => (
  <svg
    viewBox="0 0 36 44"
    width={size}
    height={(size * 44) / 36}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: `drop-shadow(0 4px 8px ${starColor}44)` }}
  >
    <defs>
      <linearGradient id={`sparkleDropGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor={primaryColor} />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>

    {/* Drop Body */}
    <path
      d="M 18,3 C 18,3 5,18 5,26 A 13,13 0 0,0 31,26 C 31,18 18,3 18,3 Z"
      fill={`url(#sparkleDropGrad-${size})`}
      stroke="#ffffff"
      strokeWidth="1.2"
    />

    {/* Centered Golden Starburst */}
    <path
      d="M 18,17 L 19.5,21.5 L 24,23 L 19.5,24.5 L 18,29 L 16.5,24.5 L 12,23 L 16.5,21.5 Z"
      fill={starColor}
      stroke="#ffffff"
      strokeWidth="0.8"
    />

    {/* Small secondary sparkle */}
    <circle cx="25" cy="14" r="1.8" fill="#ffffff" />
    <circle cx="9" cy="30" r="1.2" fill="#ffffff" />
  </svg>
);
