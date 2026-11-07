/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
}

/**
 * High-fidelity embossed 3D Zen Coin
 */
export const CoinIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={`inline-block flex-shrink-0 drop-shadow-sm select-none ${className}`}
  >
    <defs>
      <linearGradient id="coinRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd859" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="coinFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="60%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Outer rim */}
    <circle cx="16" cy="16" r="15" fill="url(#coinRim)" stroke="#92400e" strokeWidth="1" />
    {/* Inner face */}
    <circle cx="16" cy="16" r="12" fill="url(#coinFace)" stroke="#d97706" strokeWidth="0.8" />
    {/* Inner ring */}
    <circle cx="16" cy="16" r="9.5" fill="none" stroke="#b45309" strokeWidth="0.75" strokeDasharray="2 1" />
    {/* Center Zen character / symbol */}
    <path
      d="M 12,12 H 20 M 16,12 V 20 M 13,20 H 19"
      stroke="#78350f"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Radiant water drop life
 */
export const DropIcon: React.FC<{ active?: boolean; size?: number; className?: string }> = ({
  active = true,
  size = 18,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block flex-shrink-0 transition-transform duration-300 ${active ? 'scale-100 drop-shadow-sm' : 'scale-90 opacity-30'} ${className}`}
  >
    <defs>
      <linearGradient id="dropActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="dropInactiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <path
      d="M 12,2 C 12,2 4,12 4,16 A 8,8 0 0,0 20,16 C 20,12 12,2 12,2 Z"
      fill={active ? 'url(#dropActiveGrad)' : 'url(#dropInactiveGrad)'}
      stroke={active ? '#0369a1' : '#334155'}
      strokeWidth="1.2"
    />
    {active && (
      <ellipse cx="8.5" cy="14" rx="2" ry="4" transform="rotate(-30 8.5 14)" fill="#ffffff" opacity="0.65" />
    )}
  </svg>
);

/**
 * Bomb booster with animated fuse glow
 */
export const BombIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={`inline-block flex-shrink-0 ${className}`}>
    <defs>
      <radialGradient id="bombShine" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
    </defs>
    {/* Fuse spark */}
    <circle cx="24" cy="5" r="2.5" fill="#facc15" />
    <path d="M 24,5 L 21,9" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* Neck cap */}
    <rect x="16" y="9" width="6" height="3" rx="1" fill="#71717a" transform="rotate(-35 19 10)" />
    {/* Body */}
    <circle cx="14" cy="18" r="10" fill="url(#bombShine)" stroke="#09090b" strokeWidth="1" />
    {/* Specular sheen */}
    <ellipse cx="10" cy="14" rx="2.5" ry="4.5" transform="rotate(-35 10 14)" fill="#ffffff" opacity="0.4" />
  </svg>
);

/**
 * X-Ray scanner booster
 */
export const XrayIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={`inline-block flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="xrayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    <path
      d="M 2,16 C 6,8 26,8 30,16 C 26,24 6,24 2,16 Z"
      fill="none"
      stroke="url(#xrayGrad)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="6" fill="#14b8a6" fillOpacity="0.25" stroke="#2dd4bf" strokeWidth="2" />
    <circle cx="16" cy="16" r="2.5" fill="#5eead4" />
    <path d="M 8,7 L 4,11 M 24,7 L 28,11 M 8,25 L 4,21 M 24,25 L 28,21" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Smart Hint bulb icon
 */
export const HintIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={`inline-block flex-shrink-0 ${className}`}>
    <defs>
      <radialGradient id="bulbGlow" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="65%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
    </defs>
    {/* Rays */}
    <path d="M 16,1 V 4 M 5,7 L 7,9 M 27,7 L 25,9 M 2,16 H 5 M 27,16 H 30" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
    {/* Bulb glass */}
    <path
      d="M 10,16 C 10,12.7 12.7,10 16,10 C 19.3,10 22,12.7 22,16 C 22,18.5 20.5,20.5 19,22 H 13 C 11.5,20.5 10,18.5 10,16 Z"
      fill="url(#bulbGlow)"
      stroke="#b45309"
      strokeWidth="1.2"
    />
    {/* Filament */}
    <path d="M 14,16 Q 16,13 18,16" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    {/* Screw base */}
    <path d="M 13,23 H 19 M 14,25 H 18 M 15,27 H 17" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Undo swoop arrow icon
 */
export const UndoIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`inline-block flex-shrink-0 ${className}`}>
    <path d="M 9,14 L 4,9 L 9,4" />
    <path d="M 20,20 V 17 A 8,8 0 0,0 4,9" />
  </svg>
);

/**
 * Flame streak icon
 */
export const FlameIcon: React.FC<IconProps> = ({ size = 18, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={`inline-block flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
    </defs>
    <path
      d="M 12,2 C 12,6 8,8 8,13 A 6,6 0 0,0 20,13 C 20,8 14,5 12,2 Z"
      fill="url(#flameGrad)"
      stroke="#c2410c"
      strokeWidth="0.8"
    />
    <path
      d="M 12,11 C 12,13 10.5,14 10.5,16 A 2.5,2.5 0 0,0 15.5,16 C 15.5,13.5 13,12 12,11 Z"
      fill="#fef08a"
    />
  </svg>
);

/**
 * Star icon (1-3 stars)
 */
export const StarIcon: React.FC<{ filled?: boolean; size?: number; className?: string }> = ({
  filled = true,
  size = 24,
  className = '',
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`inline-block flex-shrink-0 transition-transform duration-300 ${filled ? 'drop-shadow-sm scale-100' : 'scale-90 opacity-30'} ${className}`}
  >
    <defs>
      <linearGradient id="starFilledGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? 'url(#starFilledGrad)' : '#94a3b8'}
      stroke={filled ? '#b45309' : '#64748b'}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 8 Custom Vector Mascot Avatars (Fox, Panda, Lion, Frog, Owl, Octo, Unicorn, Penguin)
 */
export const AVATAR_KEYS = [
  'fox',
  'panda',
  'lion',
  'frog',
  'owl',
  'octo',
  'unicorn',
  'penguin',
] as const;

export type AvatarId = typeof AVATAR_KEYS[number];

export const EMOJI_TO_AVATAR: Record<string, AvatarId> = {
  '🦊': 'fox',
  '🐼': 'panda',
  '🦁': 'lion',
  '🐸': 'frog',
  '🦉': 'owl',
  '🐙': 'octo',
  '🦄': 'unicorn',
  '🐧': 'penguin',
  fox: 'fox',
  panda: 'panda',
  lion: 'lion',
  frog: 'frog',
  owl: 'owl',
  octo: 'octo',
  unicorn: 'unicorn',
  penguin: 'penguin',
};

export const CharacterAvatar: React.FC<{ id: string; size?: number; className?: string }> = ({
  id,
  size = 40,
  className = '',
}) => {
  const normId: AvatarId = EMOJI_TO_AVATAR[id] || (id.replace(/[^a-z]/gi, '').toLowerCase() as AvatarId) || 'fox';

  const renderContent = () => {
    switch (normId) {
      case 'panda':
        return (
          <g>
            <circle cx="24" cy="24" r="18" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <circle cx="10" cy="11" r="5" fill="#1e293b" />
            <circle cx="38" cy="11" r="5" fill="#1e293b" />
            <ellipse cx="18" cy="22" rx="4" ry="5" fill="#1e293b" />
            <ellipse cx="30" cy="22" rx="4" ry="5" fill="#1e293b" />
            <circle cx="19" cy="21" r="1.5" fill="#ffffff" />
            <circle cx="31" cy="21" r="1.5" fill="#ffffff" />
            <ellipse cx="24" cy="27" rx="3" ry="2" fill="#1e293b" />
            <path d="M 21,30 Q 24,33 27,30" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
      case 'lion':
        return (
          <g>
            <circle cx="24" cy="24" r="20" fill="#f59e0b" stroke="#b45309" strokeWidth="1.8" />
            <circle cx="24" cy="24" r="14" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="19" cy="22" r="2.5" fill="#78350f" />
            <circle cx="29" cy="22" r="2.5" fill="#78350f" />
            <polygon points="24,25 21,28 27,28" fill="#b45309" />
            <path d="M 21,30 Q 24,32 27,30" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
      case 'frog':
        return (
          <g>
            <ellipse cx="24" cy="26" rx="18" ry="14" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <circle cx="14" cy="14" r="7" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <circle cx="34" cy="14" r="7" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
            <circle cx="14" cy="14" r="3.5" fill="#14532d" />
            <circle cx="34" cy="14" r="3.5" fill="#14532d" />
            <circle cx="15" cy="13" r="1" fill="#ffffff" />
            <circle cx="35" cy="13" r="1" fill="#ffffff" />
            <path d="M 14,29 Q 24,35 34,29" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="26" r="3" fill="#f43f5e" opacity="0.4" />
            <circle cx="36" cy="26" r="3" fill="#f43f5e" opacity="0.4" />
          </g>
        );
      case 'owl':
        return (
          <g>
            <circle cx="24" cy="24" r="18" fill="#818cf8" stroke="#4338ca" strokeWidth="2" />
            <polygon points="8,10 14,16 8,16" fill="#4338ca" />
            <polygon points="40,10 34,16 40,16" fill="#4338ca" />
            <circle cx="17" cy="22" r="6" fill="#ffffff" stroke="#4338ca" strokeWidth="1.5" />
            <circle cx="31" cy="22" r="6" fill="#ffffff" stroke="#4338ca" strokeWidth="1.5" />
            <circle cx="17" cy="22" r="3" fill="#312e81" />
            <circle cx="31" cy="22" r="3" fill="#312e81" />
            <polygon points="24,24 21,29 27,29" fill="#f59e0b" />
          </g>
        );
      case 'octo':
        return (
          <g>
            <circle cx="24" cy="18" r="14" fill="#f472b6" stroke="#be185d" strokeWidth="2" />
            <circle cx="19" cy="17" r="2.5" fill="#831843" />
            <circle cx="29" cy="17" r="2.5" fill="#831843" />
            <circle cx="20" cy="16" r="0.8" fill="#ffffff" />
            <circle cx="30" cy="16" r="0.8" fill="#ffffff" />
            <path d="M 22,23 Q 24,25 26,23" fill="none" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" />
            {/* Tentacles */}
            <path d="M 12,28 Q 10,38 15,38 Q 20,38 20,30 Q 24,40 28,30 Q 30,38 36,34" fill="none" stroke="#be185d" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'unicorn':
        return (
          <g>
            <circle cx="24" cy="26" r="16" fill="#fdf4ff" stroke="#c084fc" strokeWidth="2" />
            {/* Horn */}
            <polygon points="24,4 20,16 28,16" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
            <path d="M 12,18 Q 8,12 14,14" fill="#c084fc" />
            <circle cx="19" cy="24" r="2.5" fill="#581c87" />
            <circle cx="29" cy="24" r="2.5" fill="#581c87" />
            <circle cx="20" cy="23" r="0.8" fill="#ffffff" />
            <circle cx="30" cy="23" r="0.8" fill="#ffffff" />
            <path d="M 21,29 Q 24,31 27,29" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
      case 'penguin':
        return (
          <g>
            <circle cx="24" cy="24" r="18" fill="#0f172a" stroke="#020617" strokeWidth="1.5" />
            <ellipse cx="24" cy="27" rx="11" ry="12" fill="#f8fafc" />
            <circle cx="19" cy="20" r="2" fill="#0f172a" />
            <circle cx="29" cy="20" r="2" fill="#0f172a" />
            <circle cx="19.5" cy="19.5" r="0.6" fill="#ffffff" />
            <circle cx="29.5" cy="19.5" r="0.6" fill="#ffffff" />
            <polygon points="24,22 21,26 27,26" fill="#f97316" />
          </g>
        );
      case 'fox':
      default:
        return (
          <g>
            <polygon points="10,8 16,18 8,18" fill="#c2410c" />
            <polygon points="38,8 32,18 40,18" fill="#c2410c" />
            <circle cx="24" cy="24" r="16" fill="#ea580c" stroke="#9a3412" strokeWidth="1.8" />
            <path d="M 14,24 Q 24,36 34,24 Z" fill="#ffedd5" />
            <circle cx="18" cy="20" r="2.5" fill="#431407" />
            <circle cx="30" cy="20" r="2.5" fill="#431407" />
            <circle cx="19" cy="19" r="0.8" fill="#ffffff" />
            <circle cx="31" cy="19" r="0.8" fill="#ffffff" />
            <circle cx="24" cy="25" r="2" fill="#431407" />
            <path d="M 22,28 Q 24,30 26,28" fill="none" stroke="#431407" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 drop-shadow-sm select-none ${className}`}
    >
      {renderContent()}
    </svg>
  );
};

/**
 * Rank Medal (Gold, Silver, Bronze, or standard)
 */
export const RankMedal: React.FC<{ rank: number; size?: number; className?: string }> = ({
  rank,
  size = 24,
  className = '',
}) => {
  let ribbonColor = '#dc2626';
  let medalFill = '#facc15';
  let medalStroke = '#b45309';

  if (rank === 1) {
    medalFill = 'url(#goldGrad)';
    medalStroke = '#b45309';
  } else if (rank === 2) {
    medalFill = 'url(#silverGrad)';
    medalStroke = '#64748b';
    ribbonColor = '#2563eb';
  } else if (rank === 3) {
    medalFill = 'url(#bronzeGrad)';
    medalStroke = '#7c2d12';
    ribbonColor = '#059669';
  }

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={`inline-block flex-shrink-0 ${className}`}>
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>
      {/* Ribbons */}
      <polygon points="12,2 16,12 8,12" fill={ribbonColor} opacity="0.9" />
      <polygon points="20,2 16,12 24,12" fill={ribbonColor} />
      {/* Coin/Medal disk */}
      <circle cx="16" cy="20" r="10" fill={medalFill} stroke={medalStroke} strokeWidth="1.2" />
      <circle cx="16" cy="20" r="7.5" fill="none" stroke={medalStroke} strokeWidth="0.8" strokeDasharray="1.5 1" />
      {/* Text rank */}
      <text
        x="16"
        y="23.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill={rank === 2 ? '#334155' : rank === 3 ? '#431407' : '#78350f'}
      >
        {rank}
      </text>
    </svg>
  );
};

/**
 * Ad-Free Gold Shield icon
 */
export const ShieldIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={`inline-block flex-shrink-0 ${className}`}>
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path
      d="M 12,2 L 4,5 V 11 C 4,16.5 7.5,21.5 12,23 C 16.5,21.5 20,16.5 20,11 V 5 Z"
      fill="url(#shieldGrad)"
      stroke="#1d4ed8"
      strokeWidth="1.2"
    />
    <path d="M 9,11 L 11,13 L 15,9" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
