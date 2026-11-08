/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeColors } from '../game/types';
import { soundEngine } from '../audio/soundEngine';

export type CelebrationMode = 'all' | 'fireworks' | 'confetti' | 'drops' | 'petals';

interface CelebrationEffectsProps {
  theme?: ThemeColors;
  reduceMotion?: boolean;
  activeMode?: CelebrationMode;
  onModeChange?: (mode: CelebrationMode) => void;
  className?: string;
}

interface FireworkBurst {
  id: number;
  cx: number; // percentage (0-100)
  cy: number; // percentage (0-100)
  color: string;
  delay: number; // seconds
  size: number;
  particles: Array<{
    angle: number;
    speed: number;
    dist: number;
    color: string;
    size: number;
  }>;
}

interface ConfettiPiece {
  id: number;
  x: number; // percentage (0-100)
  driftX: number; // px horizontal drift
  color: string;
  shape: 'rect' | 'circle' | 'ribbon' | 'diamond';
  size: number;
  duration: number; // seconds
  delay: number; // seconds
  rotX: number;
  rotY: number;
  rotZ: number;
}

interface DropParticle {
  id: number;
  startX: number;
  startY: number;
  tx: number;
  ty: number;
  peakY: number;
  rot: number;
  scale: number;
  duration: number;
  delay: number;
  variant: 'mascot' | 'dew' | 'sparkle';
  size: number;
}

interface ZenPetal {
  id: number;
  startX: number;
  driftX: number;
  color: string;
  duration: number;
  delay: number;
  scale: number;
  rot: number;
  swaySpeed: number;
}

interface TapBurst {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({
  theme,
  reduceMotion = false,
  activeMode = 'all',
  onModeChange,
  className = '',
}) => {
  const [internalMode, setInternalMode] = useState<CelebrationMode>(activeMode);
  const [tapBursts, setTapBursts] = useState<TapBurst[]>([]);

  useEffect(() => {
    setInternalMode(activeMode);
  }, [activeMode]);

  const handleSelectMode = (m: CelebrationMode) => {
    setInternalMode(m);
    onModeChange?.(m);
    soundEngine.playTone(540, 0.08, 'sine', 0.15);
  };

  const primaryColor = theme?.drop || '#38bdf8';
  const accentColor = theme?.accent || '#fbbf24';
  const lineColor = theme?.line || '#6b4528';

  // Palette for multi-color celebrations
  const vibrantColors = useMemo(
    () => [
      '#f59e0b', // gold
      '#06b6d4', // cyan
      '#ec4899', // pink
      '#10b981', // emerald
      '#8b5cf6', // purple
      '#f97316', // orange
      '#3b82f6', // royal blue
      '#e11d48', // rose
      primaryColor,
      accentColor,
    ],
    [primaryColor, accentColor]
  );

  // 1. GENERATE FIREWORKS
  const fireworks: FireworkBurst[] = useMemo(() => {
    if (reduceMotion) return [];
    if (internalMode !== 'all' && internalMode !== 'fireworks') return [];

    const bursts: FireworkBurst[] = [];
    const count = 5;
    const positions = [
      { cx: 20, cy: 22 },
      { cx: 80, cy: 26 },
      { cx: 35, cy: 15 },
      { cx: 65, cy: 18 },
      { cx: 50, cy: 28 },
    ];

    for (let b = 0; b < count; b++) {
      const pos = positions[b];
      const burstColor = vibrantColors[b % vibrantColors.length];
      const pCount = 14;
      const particles = [];

      for (let p = 0; p < pCount; p++) {
        const angle = (p / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = 70 + Math.random() * 85;
        const pColor = Math.random() > 0.4 ? burstColor : '#ffffff';
        particles.push({
          angle,
          speed,
          dist: speed,
          color: pColor,
          size: Math.floor(4 + Math.random() * 5),
        });
      }

      bursts.push({
        id: b,
        cx: pos.cx,
        cy: pos.cy,
        color: burstColor,
        delay: 0.15 + b * 0.45,
        size: 90,
        particles,
      });
    }

    return bursts;
  }, [internalMode, reduceMotion, vibrantColors]);

  // 2. GENERATE CONFETTI & RIBBONS
  const confettiList: ConfettiPiece[] = useMemo(() => {
    if (internalMode !== 'all' && internalMode !== 'confetti') return [];
    const count = reduceMotion ? 16 : 42;
    const pieces: ConfettiPiece[] = [];
    const shapes: Array<'rect' | 'circle' | 'ribbon' | 'diamond'> = ['rect', 'ribbon', 'circle', 'diamond'];

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        driftX: (Math.random() - 0.5) * 160,
        color: vibrantColors[i % vibrantColors.length],
        shape: shapes[i % shapes.length],
        size: Math.floor(8 + Math.random() * 8),
        duration: 2.2 + Math.random() * 1.5,
        delay: Math.random() * 0.8,
        rotX: Math.random() * 720,
        rotY: Math.random() * 720,
        rotZ: (Math.random() - 0.5) * 360,
      });
    }
    return pieces;
  }, [internalMode, reduceMotion, vibrantColors]);

  // 3. GENERATE WATER DROP / MASCOT FOUNTAIN
  const dropParticles: DropParticle[] = useMemo(() => {
    if (internalMode !== 'all' && internalMode !== 'drops') return [];
    const count = reduceMotion ? 12 : 32;
    const list: DropParticle[] = [];

    for (let i = 0; i < count; i++) {
      let startX: number;
      let startY: number;
      let tx: number;
      let ty: number;
      let peakY: number;

      if (i % 2 === 0) {
        // Left Cannon
        startX = 10 + Math.random() * 8;
        startY = 88 + Math.random() * 10;
        const angle = -Math.PI * 0.42 + (Math.random() - 0.5) * 0.4;
        const dist = 240 + Math.random() * 200;
        tx = Math.cos(angle) * dist + 160;
        ty = Math.sin(angle) * dist;
        peakY = ty - 130;
      } else {
        // Right Cannon
        startX = 82 + Math.random() * 8;
        startY = 88 + Math.random() * 10;
        const angle = -Math.PI * 0.58 + (Math.random() - 0.5) * 0.4;
        const dist = 240 + Math.random() * 200;
        tx = Math.cos(angle) * dist - 160;
        ty = Math.sin(angle) * dist;
        peakY = ty - 130;
      }

      const variants: Array<'mascot' | 'dew' | 'sparkle'> = ['mascot', 'dew', 'sparkle'];
      list.push({
        id: i,
        startX,
        startY,
        tx,
        ty,
        peakY,
        rot: (Math.random() - 0.5) * 480,
        scale: 0.75 + Math.random() * 0.6,
        duration: 1.8 + Math.random() * 0.7,
        delay: Math.random() * 0.6,
        variant: variants[i % variants.length],
        size: Math.floor(22 + Math.random() * 16),
      });
    }
    return list;
  }, [internalMode, reduceMotion]);

  // 4. GENERATE ZEN FLOATING PETALS
  const zenPetals: ZenPetal[] = useMemo(() => {
    if (internalMode !== 'all' && internalMode !== 'petals') return [];
    const count = reduceMotion ? 10 : 26;
    const list: ZenPetal[] = [];
    const petalColors = ['#fbcfe8', '#f472b6', '#fed7aa', '#fde047', '#cbd5e1'];

    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        startX: Math.random() * 100,
        driftX: (Math.random() - 0.5) * 180,
        color: petalColors[i % petalColors.length],
        duration: 3.5 + Math.random() * 2.5,
        delay: Math.random() * 1.2,
        scale: 0.7 + Math.random() * 0.7,
        rot: Math.random() * 360,
        swaySpeed: 1.5 + Math.random() * 1.5,
      });
    }
    return list;
  }, [internalMode, reduceMotion]);

  // 5. INTERACTIVE TAP BURST HANDLER
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if clicking outside interactive buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const randomColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];

    const newBurst: TapBurst = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: randomColor,
    };

    setTapBursts((prev) => [...prev.slice(-6), newBurst]);
    soundEngine.playTone(600 + Math.random() * 300, 0.1, 'triangle', 0.12);
    soundEngine.vibrate(15);
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 pointer-events-auto overflow-hidden select-none z-40 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        /* Sunburst Rotating Glory Aura */
        @keyframes sunburstSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Firework Sparkler Trajectory */
        @keyframes fireworkParticleSpark {
          0% {
            transform: translate3d(0, 0, 0) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate3d(calc(var(--fx) * 0.25), calc(var(--fy) * 0.25), 0) scale(1.4);
          }
          70% {
            opacity: 0.95;
            transform: translate3d(calc(var(--fx) * 0.85), calc(var(--fy) * 0.85 + 10px), 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--fx), calc(var(--fy) + 35px), 0) scale(0.2);
          }
        }

        /* Expanding Shockwave Ring */
        @keyframes shockwaveExpand {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.8);
            opacity: 0;
          }
        }

        /* Confetti 3D Tumble */
        @keyframes confettiFall {
          0% {
            transform: translate3d(0, -30px, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            transform: translate3d(var(--drift-x), 105vh, 0) rotateX(var(--rot-x)) rotateY(var(--rot-y)) rotateZ(var(--rot-z));
            opacity: 0;
          }
        }

        /* Water Drop Parabola */
        @keyframes dropTrajectory {
          0% {
            transform: translate3d(0, 0, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
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

        /* Zen Petal Sway Drift */
        @keyframes petalFall {
          0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.9;
          }
          50% {
            transform: translate3d(calc(var(--petal-x) * 0.5 + 35px), 48vh, 0) rotate(180deg);
          }
          88% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(var(--petal-x), 105vh, 0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes dropWobble {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.15, 0.88); }
        }

        .animate-sunburst-spin {
          animation: sunburstSpin 28s linear infinite;
        }

        .animate-confetti-piece {
          animation: confettiFall var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--delay) forwards;
          will-change: transform, opacity;
        }

        .animate-firework-spark {
          animation: fireworkParticleSpark 1.3s cubic-bezier(0.12, 0.8, 0.32, 1) var(--delay) forwards;
          will-change: transform, opacity;
        }

        .animate-shockwave {
          animation: shockwaveExpand 1.1s cubic-bezier(0.1, 0.7, 0.3, 1) var(--delay) forwards;
          will-change: transform, opacity;
        }

        .animate-drop-particle {
          animation: dropTrajectory var(--duration) cubic-bezier(0.22, 1, 0.36, 1) var(--delay) forwards;
          will-change: transform, opacity;
        }

        .animate-petal-particle {
          animation: petalFall var(--duration) ease-in-out var(--delay) forwards;
          will-change: transform, opacity;
        }

        .animate-drop-wobble {
          animation: dropWobble 0.6s ease-in-out infinite;
        }
      `}</style>

      {/* --- ANIMATION 1: ROTATING SUNBURST LIGHT-RAY AURA --- */}
      {!reduceMotion && (
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none opacity-25 dark:opacity-35"
          style={{ width: '900px', height: '900px' }}
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full animate-sunburst-spin"
            fill="none"
          >
            <defs>
              <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
                <stop offset="60%" stopColor={primaryColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            {Array.from({ length: 24 }).map((_, i) => (
              <path
                key={i}
                d={`M 200,200 L ${200 + 190 * Math.cos(((i * 15 - 4) * Math.PI) / 180)},${200 + 190 * Math.sin(((i * 15 - 4) * Math.PI) / 180)} A 190,190 0 0,1 ${200 + 190 * Math.cos(((i * 15 + 4) * Math.PI) / 180)},${200 + 190 * Math.sin(((i * 15 + 4) * Math.PI) / 180)} Z`}
                fill="url(#sunburstGrad)"
              />
            ))}
          </svg>
        </div>
      )}

      {/* --- ANIMATION 2: PYROTECHNIC FIREWORKS & SHOCKWAVES --- */}
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute pointer-events-none"
          style={{ left: `${fw.cx}%`, top: `${fw.cy}%` }}
        >
          {/* Shockwave expanding ring */}
          <div
            className="absolute rounded-full border-2 animate-shockwave"
            style={
              {
                width: `${fw.size}px`,
                height: `${fw.size}px`,
                borderColor: fw.color,
                '--delay': `${fw.delay}s`,
              } as React.CSSProperties
            }
          />
          {/* Secondary inner ring */}
          <div
            className="absolute rounded-full border border-white/80 animate-shockwave"
            style={
              {
                width: `${fw.size * 0.6}px`,
                height: `${fw.size * 0.6}px`,
                '--delay': `${fw.delay + 0.08}s`,
              } as React.CSSProperties
            }
          />
          {/* Radial Firework Particles */}
          {fw.particles.map((pt, pIdx) => {
            const fx = Math.cos(pt.angle) * pt.dist;
            const fy = Math.sin(pt.angle) * pt.dist;
            return (
              <div
                key={pIdx}
                className="absolute animate-firework-spark"
                style={
                  {
                    left: 0,
                    top: 0,
                    '--fx': `${fx}px`,
                    '--fy': `${fy}px`,
                    '--delay': `${fw.delay}s`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="rounded-full shadow-xs"
                  style={{
                    width: `${pt.size}px`,
                    height: `${pt.size}px`,
                    backgroundColor: pt.color,
                    boxShadow: `0 0 8px ${pt.color}`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}

      {/* --- ANIMATION 3: 3D CONFETTI & RIBBON STREAMERS --- */}
      {confettiList.map((c) => (
        <div
          key={c.id}
          className="absolute animate-confetti-piece pointer-events-none"
          style={
            {
              left: `${c.x}%`,
              top: '-20px',
              '--drift-x': `${c.driftX}px`,
              '--duration': `${c.duration}s`,
              '--delay': `${c.delay}s`,
              '--rot-x': `${c.rotX}deg`,
              '--rot-y': `${c.rotY}deg`,
              '--rot-z': `${c.rotZ}deg`,
            } as React.CSSProperties
          }
        >
          {c.shape === 'rect' && (
            <div
              style={{
                width: `${c.size * 1.5}px`,
                height: `${c.size * 0.75}px`,
                backgroundColor: c.color,
                borderRadius: '2px',
                boxShadow: `0 2px 5px ${c.color}66`,
              }}
            />
          )}
          {c.shape === 'circle' && (
            <div
              style={{
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                borderRadius: '9999px',
                boxShadow: `0 2px 4px ${c.color}55`,
              }}
            />
          )}
          {c.shape === 'diamond' && (
            <div
              style={{
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                transform: 'rotate(45deg)',
                boxShadow: `0 2px 6px ${c.color}55`,
              }}
            />
          )}
          {c.shape === 'ribbon' && (
            <svg width={c.size * 2} height={c.size} viewBox="0 0 24 12" fill="none">
              <path
                d="M 2,2 C 8,10 16,0 22,8"
                stroke={c.color}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      ))}

      {/* --- ANIMATION 4: WATER DROP & MASCOT FOUNTAIN --- */}
      {dropParticles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-drop-particle pointer-events-none"
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
              <JoyfulMascotDropSvg size={p.size} primaryColor={primaryColor} accentColor={accentColor} />
            )}
            {p.variant === 'dew' && (
              <CrystallineDewDropSvg size={p.size} primaryColor={primaryColor} />
            )}
            {p.variant === 'sparkle' && (
              <SparkleStarDropSvg size={p.size} primaryColor={primaryColor} starColor={accentColor} />
            )}
          </div>
        </div>
      ))}

      {/* --- ANIMATION 5: ZEN FLOATING PETALS & BLOSSOMS --- */}
      {zenPetals.map((pt) => (
        <div
          key={pt.id}
          className="absolute animate-petal-particle pointer-events-none"
          style={
            {
              left: `${pt.startX}%`,
              top: '-20px',
              '--petal-x': `${pt.driftX}px`,
              '--duration': `${pt.duration}s`,
              '--delay': `${pt.delay}s`,
              transform: `scale(${pt.scale})`,
            } as React.CSSProperties
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M 12,2 C 16,8 21,12 18,18 C 14,22 8,21 5,16 C 3,11 7,6 12,2 Z"
              fill={pt.color}
              opacity="0.85"
            />
            <path
              d="M 12,5 C 13,10 13,15 11,18"
              stroke="#ffffff"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}

      {/* --- ANIMATION 6: INTERACTIVE TAP-TO-POP FIREWORKS --- */}
      {tapBursts.map((tb) => (
        <div
          key={tb.id}
          className="absolute pointer-events-none z-50"
          style={{ left: tb.x, top: tb.y }}
        >
          <div
            className="absolute rounded-full border-2 animate-shockwave"
            style={{
              width: '70px',
              height: '70px',
              borderColor: tb.color,
              '--delay': '0s',
            } as React.CSSProperties}
          />
          {Array.from({ length: 10 }).map((_, idx) => {
            const angle = (idx / 10) * Math.PI * 2;
            const dist = 55 + (idx % 3) * 15;
            const fx = Math.cos(angle) * dist;
            const fy = Math.sin(angle) * dist;
            return (
              <div
                key={idx}
                className="absolute animate-firework-spark"
                style={
                  {
                    left: 0,
                    top: 0,
                    '--fx': `${fx}px`,
                    '--fy': `${fy}px`,
                    '--delay': '0s',
                  } as React.CSSProperties
                }
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: tb.color,
                    boxShadow: `0 0 6px ${tb.color}`,
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}

      {/* --- INTERACTIVE CELEBRATION MODE SELECTOR BAR --- */}
      <div className="absolute top-3 inset-x-0 flex flex-col items-center gap-1.5 z-50 pointer-events-auto px-4">
        <div className="flex items-center gap-1 p-1 bg-black/40 dark:bg-black/55 backdrop-blur-xl rounded-full border border-white/20 shadow-xl max-w-full overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All FX', icon: '✨' },
              { id: 'fireworks', label: 'Fireworks', icon: '🎆' },
              { id: 'confetti', label: 'Confetti', icon: '🎉' },
              { id: 'drops', label: 'Drops', icon: '💧' },
              { id: 'petals', label: 'Zen Petals', icon: '🌸' },
            ] as const
          ).map((m) => {
            const isSelected = internalMode === m.id;
            return (
              <button
                key={m.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMode(m.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-cyan-500/30 scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-white/70 font-medium tracking-wide drop-shadow-sm select-none">
          Tap anywhere on screen to launch fireworks!
        </p>
      </div>
    </div>
  );
};

/**
 * Mascot drop asset
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
    <path
      d="M 18,3 C 18,3 5,19 5,27 A 13,13 0 0,0 31,27 C 31,19 18,3 18,3 Z"
      fill={`url(#mascotDropGrad-${size})`}
      stroke="#ffffff"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M 11,20 C 9,24 10,29 13,31"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path d="M 12,23 Q 14,20 16,23" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 20,23 Q 22,20 24,23" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 16,27 Q 18,30 20,27" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" fill="#f43f5e" />
    <circle cx="10" cy="25" r="1.8" fill={accentColor} opacity="0.8" />
    <circle cx="26" cy="25" r="1.8" fill={accentColor} opacity="0.8" />
  </svg>
);

/**
 * Crystalline Dew Drop asset
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
    <path
      d="M 16,2 C 16,2 4,16 4,24 A 12,12 0 0,0 28,24 C 28,16 16,2 16,2 Z"
      fill={`url(#dewGrad-${size})`}
      stroke="#ffffff"
      strokeWidth="1.2"
    />
    <ellipse cx="11" cy="20" rx="3" ry="5.5" transform="rotate(-28 11 20)" fill="#ffffff" opacity="0.85" />
    <path d="M 19,29 C 23,28 24,25 24,22" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

/**
 * Sparkle Star Drop asset
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
    <path
      d="M 18,3 C 18,3 5,18 5,26 A 13,13 0 0,0 31,26 C 31,18 18,3 18,3 Z"
      fill={`url(#sparkleDropGrad-${size})`}
      stroke="#ffffff"
      strokeWidth="1.2"
    />
    <path
      d="M 18,17 L 19.5,21.5 L 24,23 L 19.5,24.5 L 18,29 L 16.5,24.5 L 12,23 L 16.5,21.5 Z"
      fill={starColor}
      stroke="#ffffff"
      strokeWidth="0.8"
    />
    <circle cx="25" cy="14" r="1.8" fill="#ffffff" />
    <circle cx="9" cy="30" r="1.2" fill="#ffffff" />
  </svg>
);
