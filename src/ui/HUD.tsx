/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Palette, Settings, Trophy } from 'lucide-react';
import { Mascot, type MascotMood } from './Mascot';
import { CoinIcon, DropIcon, BombIcon, XrayIcon, HintIcon, UndoIcon } from './GameIcons';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import type { BoosterType } from '../game/types';

interface HUDProps {
  levelNumber: number;
  unlockedLevel?: number;
  worldName: string;
  lives: number;
  maxLives: number;
  coins: number;
  hintsRemaining: number;
  boosters: Record<BoosterType, number>;
  bombActive: boolean;
  mascotMood: MascotMood;
  language: LanguageCode;
  onBack: () => void;
  onOpenSettings: () => void;
  onOpenThemePicker: () => void;
  onUseHint: () => void;
  onUseUndo: () => void;
  onToggleBomb: () => void;
  onUseXray: () => void;
  onUseExtraDrop: () => void;
  canUndo: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  levelNumber,
  unlockedLevel = 1,
  worldName,
  lives,
  maxLives,
  coins,
  hintsRemaining,
  boosters,
  bombActive,
  mascotMood,
  language,
  onBack,
  onOpenSettings,
  onOpenThemePicker,
  onUseHint,
  onUseUndo,
  onToggleBomb,
  onUseXray,
  onUseExtraDrop,
  canUndo,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const totalLevels = 500;
  const clampedUnlocked = Math.max(1, Math.min(totalLevels, unlockedLevel));
  const progressPercent = Math.min(100, Math.max(0.6, (clampedUnlocked / totalLevels) * 100));

  return (
    <header className="w-full flex flex-col pointer-events-none select-none z-10 shrink-0">
      {/* Top Bar: Nav, Title & Utilities with Glassmorphism */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 pointer-events-auto">
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="w-11 h-11 flex items-center justify-center rounded-2xl glass-button active:scale-90 transition-transform text-[var(--theme-text)] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-2xl glass-panel-subtle text-[var(--theme-text)] border border-theme-subtle">
          <Mascot mood={mascotMood} size={34} />
          <div className="text-center leading-tight">
            <h1 className="text-sm font-extrabold tracking-tight">
              {t('playLevel', { level: levelNumber })}
            </h1>
            <p className="text-[10px] opacity-75 font-semibold">{worldName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThemePicker}
            aria-label="Change theme"
            className="w-11 h-11 flex items-center justify-center rounded-2xl glass-button active:scale-90 transition-transform text-[var(--theme-text)] cursor-pointer"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-11 h-11 flex items-center justify-center rounded-2xl glass-button active:scale-90 transition-transform text-[var(--theme-text)] cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visual 500-Level Campaign Progress Bar */}
      <div className="w-full px-3.5 pt-0.5 pb-1 pointer-events-auto">
        <div className="w-full glass-panel-subtle rounded-2xl px-3 py-1.5 border border-theme-subtle flex flex-col gap-1 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--theme-text)]">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500 drop-shadow-xs" />
              <span className="tracking-tight">{t('levels')} Journey</span>
            </span>
            <div className="flex items-center gap-1.5 tabular-nums">
              <span className="font-extrabold">{clampedUnlocked}</span>
              <span className="opacity-50">/</span>
              <span className="opacity-75">500</span>
              <span className="text-[10px] font-bold text-white bg-[#28605d] px-2 py-0.5 rounded-md ml-0.5 shadow-xs">
                {progressPercent.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Progress Track */}
          <div
            className="relative w-full h-2 rounded-full bg-[#e8e2d5] overflow-hidden border border-[#dcd4c3] p-[1px]"
            role="progressbar"
            aria-valuenow={clampedUnlocked}
            aria-valuemin={1}
            aria-valuemax={500}
            aria-label={`Campaign progress: ${clampedUnlocked} of 500 levels unlocked`}
          >
            {/* World Milestone Notch Markers at 100, 200, 300, 400 */}
            <div className="absolute inset-0 pointer-events-none flex justify-between px-[20%]">
              <div className="w-[1px] h-full bg-white/60 z-10" />
              <div className="w-[1px] h-full bg-white/60 z-10" />
              <div className="w-[1px] h-full bg-white/60 z-10" />
            </div>

            {/* Animated Fill Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#266b62] to-[#d6a654] transition-all duration-700 ease-out shadow-xs relative"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Bar: Drops (Lives) & Coins */}
      <div className="flex items-center justify-between px-4 py-1 pointer-events-auto">
        {/* Drops display with 3D DropIcon vector assets */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel-subtle border border-theme-subtle" aria-label={`Lives: ${lives} of ${maxLives}`}>
          {Array.from({ length: maxLives }).map((_, idx) => (
            <DropIcon key={idx} active={idx < lives} size={20} />
          ))}
        </div>

        {/* Coins indicator */}
        <div className="flex items-center gap-1.5 glass-panel-subtle px-3 py-1.5 rounded-full text-xs font-bold tabular-nums text-[var(--theme-text)] border border-theme-subtle">
          <CoinIcon size={16} />
          <span>{coins}</span>
        </div>
      </div>

      {/* Bottom Floating Booster Dock with Frosted Glassmorphism */}
      <div className="fixed bottom-3 inset-x-0 mx-auto w-[min(94vw,420px)] flex items-center justify-around glass-card px-2 py-2 rounded-3xl shadow-2xl pointer-events-auto z-20 border border-theme-subtle">
        {/* Undo */}
        <button
          onClick={onUseUndo}
          disabled={!canUndo}
          aria-label={t('undo')}
          className={`min-w-[56px] min-h-[48px] flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl transition-all ${
            canUndo
              ? 'glass-button active:scale-90 opacity-100 text-[var(--theme-text)]'
              : 'opacity-35 cursor-not-allowed text-[var(--theme-text)]'
          }`}
        >
          <UndoIcon size={20} className={canUndo ? 'text-amber-600 dark:text-amber-300' : 'opacity-40'} />
          <span className="text-[10px] font-bold">{t('undo')}</span>
        </button>

        {/* Smart Hint */}
        <button
          onClick={onUseHint}
          aria-label={t('freeHints')}
          className="min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl glass-button active:scale-90 transition-all text-[var(--theme-text)]"
        >
          <HintIcon size={20} />
          <span className="text-[10px] font-bold flex items-center gap-0.5">
            {hintsRemaining > 0 ? (
              `${hintsRemaining} ${t('freeHints')}`
            ) : (
              <>
                30 <CoinIcon size={10} />
              </>
            )}
          </span>
        </button>

        {/* Bomb Booster */}
        <button
          onClick={onToggleBomb}
          aria-label={t('bombBooster')}
          className={`min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl transition-all ${
            bombActive
              ? 'bg-rose-500/90 border border-white/50 text-white scale-105 shadow-lg shadow-rose-500/40 backdrop-blur-md'
              : 'glass-button active:scale-90 text-[var(--theme-text)]'
          }`}
        >
          <BombIcon size={20} />
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${bombActive ? 'text-white' : ''}`}>
            {boosters.bomb > 0 ? (
              boosters.bomb
            ) : (
              <>
                45 <CoinIcon size={10} />
              </>
            )}
          </span>
        </button>

        {/* X-Ray Booster */}
        <button
          onClick={onUseXray}
          aria-label={t('xrayBooster')}
          className="min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl glass-button active:scale-90 transition-all text-[var(--theme-text)]"
        >
          <XrayIcon size={20} />
          <span className="text-[10px] font-bold flex items-center gap-0.5">
            {boosters.xray > 0 ? (
              boosters.xray
            ) : (
              <>
                40 <CoinIcon size={10} />
              </>
            )}
          </span>
        </button>

        {/* Extra Drop Booster */}
        <button
          onClick={onUseExtraDrop}
          disabled={lives >= maxLives}
          aria-label={t('extraDropBooster')}
          className={`min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl transition-all ${
            lives < maxLives
              ? 'glass-button active:scale-90 text-[var(--theme-text)]'
              : 'opacity-40 cursor-not-allowed text-[var(--theme-text)]'
          }`}
        >
          <DropIcon active={lives < maxLives} size={20} />
          <span className="text-[10px] font-bold flex items-center gap-0.5">
            {boosters.extraDrop > 0 ? (
              boosters.extraDrop
            ) : (
              <>
                35 <CoinIcon size={10} />
              </>
            )}
          </span>
        </button>
      </div>
    </header>
  );
};
