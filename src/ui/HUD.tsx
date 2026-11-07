/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Palette, Settings } from 'lucide-react';
import { Mascot, type MascotMood } from './Mascot';
import { CoinIcon, DropIcon, BombIcon, XrayIcon, HintIcon, UndoIcon } from './GameIcons';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import type { BoosterType } from '../game/types';

interface HUDProps {
  levelNumber: number;
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

  return (
    <header className="w-full flex flex-col pointer-events-none select-none z-10">
      {/* Top Bar: Nav, Title & Utilities */}
      <div className="flex items-center justify-between px-3 py-2 pointer-events-auto">
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-90 transition-transform shadow-xs"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-slate-100" />
        </button>

        <div className="flex items-center gap-2">
          <Mascot mood={mascotMood} size={36} />
          <div className="text-center leading-tight">
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {t('playLevel', { level: levelNumber })}
            </h1>
            <p className="text-[11px] opacity-75 font-medium text-slate-700 dark:text-slate-300">{worldName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThemePicker}
            aria-label="Change theme"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-90 transition-transform shadow-xs"
          >
            <Palette className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-90 transition-transform shadow-xs"
          >
            <Settings className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </button>
        </div>
      </div>

      {/* Secondary Bar: Drops (Lives) & Coins */}
      <div className="flex items-center justify-between px-4 py-1 pointer-events-auto">
        {/* Drops display with 3D DropIcon vector assets */}
        <div className="flex items-center gap-1.5" aria-label={`Lives: ${lives} of ${maxLives}`}>
          {Array.from({ length: maxLives }).map((_, idx) => (
            <DropIcon key={idx} active={idx < lives} size={20} />
          ))}
        </div>

        {/* Coins indicator */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold tabular-nums shadow-xs">
          <CoinIcon size={16} />
          <span className="text-slate-800 dark:text-slate-100">{coins}</span>
        </div>
      </div>

      {/* Bottom Floating Booster Bar */}
      <div className="fixed bottom-3 inset-x-0 mx-auto w-[min(94vw,420px)] flex items-center justify-around bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-black/10 dark:border-white/10 px-2 py-2 rounded-2xl shadow-xl pointer-events-auto z-20">
        {/* Undo */}
        <button
          onClick={onUseUndo}
          disabled={!canUndo}
          aria-label={t('undo')}
          className={`min-w-[56px] min-h-[48px] flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all ${
            canUndo
              ? 'active:scale-90 hover:bg-black/5 dark:hover:bg-white/10 opacity-100'
              : 'opacity-35 cursor-not-allowed'
          }`}
        >
          <UndoIcon size={20} className={canUndo ? 'text-amber-800 dark:text-amber-200' : 'text-slate-400'} />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{t('undo')}</span>
        </button>

        {/* Smart Hint */}
        <button
          onClick={onUseHint}
          aria-label={t('freeHints')}
          className="min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl active:scale-90 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        >
          <HintIcon size={20} />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
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
          className={`min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all ${
            bombActive
              ? 'bg-rose-500 text-white scale-105 shadow-md shadow-rose-500/30'
              : 'active:scale-90 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <BombIcon size={20} />
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${bombActive ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
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
          className="min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl active:scale-90 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        >
          <XrayIcon size={20} />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
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
          className={`min-w-[56px] min-h-[48px] relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all ${
            lives < maxLives
              ? 'active:scale-90 hover:bg-black/5 dark:hover:bg-white/10'
              : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <DropIcon active={lives < maxLives} size={20} />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
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
