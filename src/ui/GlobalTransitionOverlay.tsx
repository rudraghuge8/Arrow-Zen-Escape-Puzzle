/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { ThemeColors } from '../game/types';

export type TransitionPhase = 'idle' | 'out' | 'in';

interface GlobalTransitionOverlayProps {
  phase: TransitionPhase;
  theme?: ThemeColors;
  reduceMotion?: boolean;
}

export const GlobalTransitionOverlay: React.FC<GlobalTransitionOverlayProps> = ({
  phase,
  theme,
  reduceMotion = false,
}) => {
  if (reduceMotion || phase === 'idle') {
    return null;
  }

  const dropColor = theme?.drop || '#38bdf8';
  const isFadingOut = phase === 'out';

  return (
    <aside
      aria-hidden="true"
      aria-label="Screen transition"
      className={`fixed inset-0 z-50 pointer-events-auto flex items-center justify-center transition-all duration-150 ease-out select-none ${
        isFadingOut
          ? 'opacity-100 backdrop-blur-md bg-black/25 dark:bg-black/40'
          : 'opacity-0 backdrop-blur-xs bg-black/0 pointer-events-none'
      }`}
    >
      {/* Center Subtle Zen Water-Drop Emblem */}
      <div
        className={`transform transition-all duration-150 ease-out flex flex-col items-center gap-2 ${
          isFadingOut ? 'scale-100 opacity-90' : 'scale-90 opacity-0'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center shadow-2xl border border-white/30 backdrop-blur-xl">
          <svg
            viewBox="0 0 24 24"
            width={26}
            height={26}
            fill="none"
            className="animate-pulse"
          >
            <defs>
              <linearGradient id="transDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor={dropColor} />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            <path
              d="M 12,2 C 12,2 4,12 4,16 A 8,8 0 0,0 20,16 C 20,12 12,2 12,2 Z"
              fill="url(#transDropGrad)"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            <ellipse cx="8.5" cy="14" rx="2" ry="4" transform="rotate(-30 8.5 14)" fill="#ffffff" opacity="0.75" />
          </svg>
        </div>
      </div>
    </aside>
  );
};
