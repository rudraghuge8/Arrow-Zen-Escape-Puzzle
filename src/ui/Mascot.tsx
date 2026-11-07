/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type MascotMood = 'happy' | 'worried' | 'cheering' | 'sleepy' | 'zen';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 56,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Droppy mascot (${mood})`}
      role="img"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible drop-shadow-sm select-none pointer-events-none"
      >
        <defs>
          <linearGradient id="droppyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67c5ff" />
            <stop offset="100%" stopColor="#2b8ee5" />
          </linearGradient>
          <filter id="droppyGlow" x1="-20%" y1="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Droppy Body: Teardrop curve */}
        <path
          d="M 50,8 C 50,8 18,52 18,72 A 32,32 0 0,0 82,72 C 82,52 50,8 50,8 Z"
          fill="url(#droppyGradient)"
          stroke="#1c6db8"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Highlight sheen */}
        <path
          d="M 32,46 C 36,36 46,26 48,22"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Cheeks */}
        {(mood === 'happy' || mood === 'cheering' || mood === 'zen') && (
          <>
            <circle cx="34" cy="74" r="5" fill="#ff7f7f" opacity="0.4" />
            <circle cx="66" cy="74" r="5" fill="#ff7f7f" opacity="0.4" />
          </>
        )}

        {/* Eyes according to mood */}
        {mood === 'happy' && (
          <>
            {/* Happy curved eyes */}
            <path d="M 36,62 Q 42,56 46,62" fill="none" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 54,62 Q 58,56 64,62" fill="none" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            {/* Gentle smile */}
            <path d="M 44,72 Q 50,78 56,72" fill="none" stroke="#0e3d6b" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {mood === 'worried' && (
          <>
            {/* Wide nervous eyes */}
            <circle cx="40" cy="62" r="4.5" fill="#0e3d6b" />
            <circle cx="60" cy="62" r="4.5" fill="#0e3d6b" />
            <circle cx="42" cy="60" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="60" r="1.5" fill="#ffffff" />
            {/* Wavy mouth */}
            <path d="M 42,75 Q 46,71 50,75 T 58,75" fill="none" stroke="#0e3d6b" strokeWidth="3" strokeLinecap="round" />
            {/* Sweat bead */}
            <path d="M 72,48 C 72,48 66,54 66,57 A 4,4 0 0,0 74,57 Z" fill="#9de2ff" stroke="#1c6db8" strokeWidth="1" />
          </>
        )}

        {mood === 'cheering' && (
          <>
            {/* Star sparkle / ecstatic closed eyes */}
            <path d="M 34,60 Q 40,54 46,60" fill="none" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 54,60 Q 60,54 66,60" fill="none" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            {/* Open mouth */}
            <path d="M 43,68 Q 50,82 57,68 Z" fill="#c04b4b" stroke="#0e3d6b" strokeWidth="2.5" />
            {/* Hands in the air */}
            <path d="M 22,66 Q 10,54 14,46" fill="none" stroke="#1c6db8" strokeWidth="4" strokeLinecap="round" />
            <path d="M 78,66 Q 90,54 86,46" fill="none" stroke="#1c6db8" strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {mood === 'sleepy' && (
          <>
            {/* Sleeping lines */}
            <line x1="34" y1="62" x2="44" y2="62" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="56" y1="62" x2="66" y2="62" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="72" r="2.5" fill="#0e3d6b" />
            {/* Floating 'Zzz' */}
            <text x="76" y="36" fill="#1c6db8" fontSize="14" fontWeight="bold" opacity="0.8">z</text>
            <text x="84" y="24" fill="#1c6db8" fontSize="11" fontWeight="bold" opacity="0.6">z</text>
          </>
        )}

        {mood === 'zen' && (
          <>
            {/* Calm peaceful eyes */}
            <path d="M 36,63 Q 41,66 46,63" fill="none" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 54,63 Q 59,66 64,63" fill="none" stroke="#0e3d6b" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 45,71 Q 50,75 55,71" fill="none" stroke="#0e3d6b" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};
