/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Map,
  Calendar,
  Gift,
  ShoppingBag,
  Trophy,
  Medal,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { Mascot } from './Mascot';
import { CharacterAvatar, CoinIcon, FlameIcon } from './GameIcons';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import type { UserProfile } from '../storage/schema';

interface HomeScreenProps {
  unlockedLevel: number;
  profile: UserProfile | null;
  coins: number;
  streakDays: number;
  language: LanguageCode;
  onPlayCurrentLevel: () => void;
  onOpenLevels: () => void;
  onOpenDaily: () => void;
  onOpenCalendar: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  unlockedLevel,
  profile,
  coins,
  streakDays,
  language,
  onPlayCurrentLevel,
  onOpenLevels,
  onOpenDaily,
  onOpenCalendar,
  onOpenShop,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenProfile,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const clearedCount = Math.max(0, unlockedLevel - 1);
  const progressPercent = Math.min(100, Math.round((clearedCount / 500) * 100));

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 max-w-md mx-auto select-none overflow-y-auto z-10">
      {/* Top Header: Profile Chip & Coins & Streak */}
      <div className="w-full flex items-center justify-between pt-2 pb-2 shrink-0">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 glass-button px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-theme-subtle text-[var(--theme-text)]"
        >
          <CharacterAvatar id={profile?.avatar || 'fox'} size={24} />
          <span className="truncate max-w-[100px]">{profile?.name || t('guest')}</span>
        </button>

        <div className="flex items-center gap-2">
          {streakDays > 0 && (
            <button
              onClick={onOpenDaily}
              className="flex items-center gap-1.5 glass-button px-3 py-1 rounded-full text-xs font-bold active:scale-95 transition-transform text-orange-500 border border-theme-subtle"
            >
              <FlameIcon size={16} />
              <span>{streakDays}d</span>
            </button>
          )}

          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 glass-button px-3.5 py-1 rounded-full text-xs font-bold active:scale-95 transition-transform text-amber-500 border border-theme-subtle"
          >
            <CoinIcon size={16} />
            <span>{coins}</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Editorial Card matching reference image */}
      <div className="flex flex-col items-center justify-center my-3 py-5 px-5 text-center gap-3.5 glass-card rounded-3xl border border-theme-subtle shadow-lg shrink-0">
        {/* Brand Header Chip matching reference logo */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5efe6] border border-[#e8e2d5]">
          <div className="w-6 h-6 rounded-lg bg-[#1f2421] flex items-center justify-center text-[#cca053] shadow-xs">
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(45 12 12)" stroke="#cca053" />
              <path d="M12 7v10M7 12h10" stroke="#f4efe6" strokeWidth={2} />
            </svg>
          </div>
          <div className="text-left leading-tight">
            <span className="text-xs font-extrabold text-[#1f2421] block tracking-tight">ArrowsGame.io</span>
            <span className="text-[10px] text-[#5a6265] block font-medium">Free puzzle game online</span>
          </div>
        </div>

        <div className="relative my-1">
          <Mascot mood="zen" size={76} />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif text-[#1f2421]">
            Arrows Game
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-[#266b62] mt-0.5">
            Free Arrow Puzzle Game
          </h2>
          <p className="text-xs text-[#5a6265] font-medium mt-1 max-w-[280px] mx-auto leading-relaxed">
            Clear paths, release arrows, and beat each board.
          </p>
        </div>

        {/* Category Tag Pills directly matching reference image */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-0.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#1b2228] text-white shadow-xs">
            Arrow Game
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#28605d] text-white shadow-xs">
            Puzzle Game
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#d6a654] text-white shadow-xs">
            Timed Challenge
          </span>
        </div>

        {/* Primary Play CTA with Editorial Rich Teal Solid Button */}
        <button
          onClick={onPlayCurrentLevel}
          className="w-full mt-2 py-3.5 px-6 bg-[#266b62] hover:bg-[#1d554e] active:scale-[0.98] text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-lg shadow-[#266b62]/25 border border-[#266b62]/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>{t('playLevel', { level: Math.min(500, unlockedLevel) })}</span>
        </button>

        {/* Clean Editorial Progress bar */}
        <div className="w-full mt-1">
          <div className="w-full h-2.5 bg-[#f5efe6] rounded-full overflow-hidden p-0.5 border border-[#e8e2d5]">
            <div
              className="h-full bg-gradient-to-r from-[#266b62] to-[#d6a654] rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[#5a6265] mt-1.5 font-bold">
            {t('levelsCleared')}: {clearedCount} / 500 ({progressPercent}%)
          </p>
        </div>
      </div>

      {/* Grid of Secondary Glassmorphic Menus with clean margins */}
      <div className="w-full grid grid-cols-2 gap-3 mt-3 mb-6 pb-6 shrink-0">
        <button
          onClick={onOpenLevels}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <Map className="w-5 h-5 text-amber-500" />
          <span>{t('levels')}</span>
        </button>

        <button
          onClick={onOpenDaily}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <Calendar className="w-5 h-5 text-blue-500" />
          <span>{t('dailyChallenge')}</span>
        </button>

        <button
          onClick={onOpenCalendar}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <Gift className="w-5 h-5 text-rose-500" />
          <span>{t('dailyReward')}</span>
        </button>

        <button
          onClick={onOpenShop}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-500" />
          <span>{t('shop')}</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>{t('leaderboard')}</span>
        </button>

        <button
          onClick={onOpenAchievements}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <Medal className="w-5 h-5 text-purple-500" />
          <span>{t('achievements')}</span>
        </button>

        <button
          onClick={onOpenHowToPlay}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <HelpCircle className="w-5 h-5 text-teal-500" />
          <span>{t('howToPlay')}</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center gap-2.5 py-3 px-3 glass-button rounded-2xl text-sm font-bold text-[var(--theme-text)] active:scale-95 transition-all shadow-xs border border-theme-subtle"
        >
          <Settings className="w-5 h-5 opacity-75" />
          <span>{t('settings')}</span>
        </button>
      </div>
    </div>
  );
};
