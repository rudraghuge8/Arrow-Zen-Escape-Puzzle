/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { soundEngine } from '../audio/soundEngine';
import { StarIcon, CoinIcon } from './GameIcons';
import type { ThemeColors } from '../game/types';
import { CelebrationEffects, type CelebrationMode } from './CelebrationEffects';

interface VictoryModalProps {
  levelNumber: number;
  stars: number;
  coinsEarned: number;
  timeElapsedMs: number;
  parWaves: number;
  difficultyScore: number;
  todayLevelsCleared: number;
  language: LanguageCode;
  theme?: ThemeColors;
  reduceMotion?: boolean;
  onNextLevel: () => void;
  onGoToLevels: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelNumber,
  stars,
  coinsEarned,
  timeElapsedMs,
  parWaves,
  difficultyScore,
  todayLevelsCleared,
  language,
  theme,
  reduceMotion = false,
  onNextLevel,
  onGoToLevels,
}) => {
  const [animatedStars, setAnimatedStars] = useState(0);
  const [animatedCoins, setAnimatedCoins] = useState(0);
  const [showRateUs, setShowRateUs] = useState(false);
  const [celebrationMode, setCelebrationMode] = useState<CelebrationMode>('all');

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  // Stagger star appearance and coin counter
  useEffect(() => {
    // Star animation delays (victory fanfare is triggered directly in handleArrowEscaped)
    for (let i = 1; i <= stars; i++) {
      setTimeout(() => {
        setAnimatedStars(i);
        soundEngine.playTone(520 + i * 160, 0.15, 'triangle', 0.2);
        soundEngine.vibrate(20);
      }, i * 260);
    }

    // Coin count up
    const duration = 800;
    const start = Date.now();
    const interval = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setAnimatedCoins(Math.floor(p * coinsEarned));
      if (p >= 1) clearInterval(interval);
    }, 40);

    // Rate us prompt check (only on 3 stars, once every 30 days)
    if (stars === 3) {
      const lastRated = Number(localStorage.getItem('zen_last_rated') || 0);
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastRated > thirtyDays) {
        setShowRateUs(true);
      }
    }

    return () => clearInterval(interval);
  }, [stars, coinsEarned]);

  // Pre-generate coin eruption particles
  const coinParticles = useMemo(() => {
    if (reduceMotion) return [];
    return Array.from({ length: 6 }).map((_, idx) => ({
      id: idx,
      tx: (idx % 2 === 0 ? 1 : -1) * (18 + Math.random() * 32),
      ty: -(20 + Math.random() * 24),
      rot: (Math.random() - 0.5) * 360,
    }));
  }, [reduceMotion]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const text = `I just solved Level ${levelNumber} in Arrow Zen with ${stars} stars! Can you escape all 500 levels?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Arrow Zen: Escape Puzzle',
          text,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const handleRate = () => {
    localStorage.setItem('zen_last_rated', String(Date.now()));
    setShowRateUs(false);
  };

  const titleText = stars === 3 ? t('flawless') : stars === 2 ? t('great') : t('cleared');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
    >
      {/* Comprehensive Multi-Type Celebration Effects Engine */}
      <CelebrationEffects
        theme={theme}
        reduceMotion={reduceMotion}
        activeMode={celebrationMode}
        onModeChange={setCelebrationMode}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-40 w-full max-w-sm glass-card text-[var(--theme-text)] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3.5 text-center border border-theme-subtle pointer-events-auto"
      >
        {/* Top-left back button */}
        <button
          onClick={onGoToLevels}
          aria-label="Back to levels"
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl glass-button transition-transform active:scale-90 text-[var(--theme-text)] border border-theme-subtle cursor-pointer z-20"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Animated Mascot Celebration Area */}
        <div className="relative flex flex-col items-center pt-2">
          {/* Golden Laurel Victory Halo */}
          <div className="absolute -top-3.5 w-20 h-7 pointer-events-none animate-laurel-float z-10">
            <svg viewBox="0 0 64 24" className="w-full h-full drop-shadow-sm" fill="none">
              <defs>
                <linearGradient id="laurelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path
                d="M 6,18 C 12,6 24,4 32,5 C 40,4 52,6 58,18"
                stroke="url(#laurelGrad)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="32" cy="4" r="2.5" fill="#fde047" />
              <circle cx="20" cy="8" r="1.8" fill="#f59e0b" />
              <circle cx="44" cy="8" r="1.8" fill="#f59e0b" />
            </svg>
          </div>

          {/* Cheerful Mascot with Squash-Stretch Bounce */}
          <div className={reduceMotion ? '' : 'animate-mascot-celebrate'}>
            <Mascot mood="cheering" size={68} />
          </div>
        </div>

        {/* Triumphant Title Header */}
        <div className="flex flex-col items-center gap-0.5">
          <h2
            id="victory-heading"
            className="text-3xl font-black tracking-tight text-[var(--theme-text)] drop-shadow-xs"
          >
            {titleText}
          </h2>
          <span className="text-xs font-semibold opacity-70 tracking-wider uppercase">
            Level {levelNumber} Completed
          </span>
        </div>

        {/* Animated Stars with Shockwave Rings */}
        <div className="flex items-center justify-center gap-4 select-none py-1">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= animatedStars;
            return (
              <div key={starIdx} className="relative flex items-center justify-center">
                {/* Shockwave ring pop upon earn */}
                {isEarned && !reduceMotion && (
                  <div
                    className="absolute rounded-full border-2 border-amber-400 animate-star-pop-ring pointer-events-none"
                    style={{
                      width: '42px',
                      height: '42px',
                    }}
                  />
                )}
                <div
                  className={`transition-all duration-300 transform ${
                    isEarned
                      ? 'scale-110 drop-shadow-lg'
                      : 'scale-90 opacity-25'
                  }`}
                >
                  <StarIcon size={42} filled={isEarned} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Coins Reward with Animated Eruption Tokens */}
        <div className="relative">
          {!reduceMotion && animatedCoins > 0 && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {coinParticles.map((cp) => (
                <div
                  key={cp.id}
                  className="absolute animate-coin-pop"
                  style={
                    {
                      left: '45%',
                      top: '25%',
                      '--coin-tx': `${cp.tx}px`,
                      '--coin-ty': `${cp.ty}px`,
                      '--coin-rot': `${cp.rot}deg`,
                    } as React.CSSProperties
                  }
                >
                  <CoinIcon size={14} />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 glass-button text-amber-600 dark:text-amber-300 font-bold px-4 py-1.5 rounded-full text-base shadow-xs border border-theme-subtle">
            <CoinIcon size={18} />
            <span className="tabular-nums">+{animatedCoins} {t('coins')}</span>
          </div>
        </div>

        {/* Stats Summary Table */}
        <div className="w-full glass-panel-subtle rounded-2xl p-3 flex flex-col gap-2 text-sm text-left border border-theme-subtle text-[var(--theme-text)]">
          <div className="flex justify-between items-center">
            <span className="opacity-75">{t('time')}</span>
            <span className="font-bold tabular-nums">{formatTime(timeElapsedMs)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">{t('parRounds')}</span>
            <span className="font-bold tabular-nums">{parWaves}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">{t('difficulty')}</span>
            <span className="font-bold">
              {levelNumber < 50 ? 'Easy' : levelNumber < 200 ? 'Normal' : levelNumber < 400 ? 'Hard' : 'Expert'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-75">{t('todayLevels')}</span>
            <span className="font-bold tabular-nums">{todayLevelsCleared}</span>
          </div>
        </div>

        {/* Optional Rate Us prompt */}
        {showRateUs && (
          <div className="w-full glass-panel-subtle border border-amber-500/30 rounded-xl p-2.5 text-xs flex items-center justify-between text-[var(--theme-text)]">
            <span>Enjoying Arrow Zen? Leave a review!</span>
            <button
              onClick={handleRate}
              className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-bold text-xs hover:bg-amber-600 flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Rate 5</span>
              <StarIcon size={12} filled />
            </button>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          <button
            onClick={onNextLevel}
            className="w-full min-h-[48px] py-3.5 bg-[#266b62] hover:bg-[#1d554e] active:scale-[0.98] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-[#266b62]/20 border border-[#266b62]/40 transition-all cursor-pointer"
          >
            {levelNumber < 500 ? t('nextLevel') : t('levels')}
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleShare}
              className="flex-1 min-h-[44px] py-2.5 glass-button rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-theme-subtle text-[var(--theme-text)] cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={onGoToLevels}
              className="flex-1 min-h-[44px] py-2.5 glass-button rounded-xl text-sm font-semibold transition-all active:scale-95 border border-theme-subtle text-[var(--theme-text)] cursor-pointer"
            >
              {t('levels')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
