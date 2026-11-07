/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { soundEngine } from '../audio/soundEngine';
import { StarIcon, CoinIcon } from './GameIcons';
import type { ThemeColors } from '../game/types';
import { VictoryDropParticles } from './VictoryDropParticles';

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

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  // Stagger star appearance and coin counter
  useEffect(() => {
    soundEngine.playSfx('win');
    soundEngine.vibrate([30, 40, 30]);

    // Star animation delays
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      {/* Joyful Water-Drop Celebration Particle Cannon System */}
      <VictoryDropParticles theme={theme} reduceMotion={reduceMotion} />

      <div className="relative z-10 w-full max-w-sm bg-[#fcf6ee] dark:bg-[#252f3b] text-[#6b4528] dark:text-[#e2e8f0] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center border border-black/10 dark:border-white/10">
        <Mascot mood="cheering" size={68} />

        <h2 id="victory-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          {titleText}
        </h2>

        {/* Animated Stars */}
        <div className="flex items-center gap-3 select-none py-1">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transition-all duration-300 transform ${
                starIdx <= animatedStars
                  ? 'scale-110 drop-shadow-md'
                  : 'scale-90 opacity-25'
              }`}
            >
              <StarIcon size={42} filled={starIdx <= animatedStars} />
            </div>
          ))}
        </div>

        {/* Coins Reward */}
        <div className="flex items-center gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold px-4 py-1.5 rounded-full text-base shadow-xs">
          <CoinIcon size={18} />
          <span>+{animatedCoins} {t('coins')}</span>
        </div>

        {/* Stats Summary Table */}
        <div className="w-full bg-black/5 dark:bg-white/5 rounded-2xl p-3 flex flex-col gap-2 text-sm text-left">
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
          <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs flex items-center justify-between">
            <span>Enjoying Arrow Zen? Leave a review!</span>
            <button
              onClick={handleRate}
              className="px-2.5 py-1 bg-amber-500 text-white rounded-lg font-bold text-xs hover:bg-amber-600 flex items-center gap-1"
            >
              <span>Rate 5</span>
              <StarIcon size={12} filled />
            </button>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            onClick={onNextLevel}
            className="w-full min-h-[48px] py-3.5 bg-[#c0773a] hover:bg-[#a9652d] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all"
          >
            {levelNumber < 500 ? t('nextLevel') : t('levels')}
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleShare}
              className="flex-1 min-h-[44px] py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={onGoToLevels}
              className="flex-1 min-h-[44px] py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 rounded-xl text-sm font-semibold transition-all"
            >
              {t('levels')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
