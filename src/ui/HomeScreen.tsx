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

      {/* Hero Centerpiece: Frosted Glassmorphism Card + Mascot + Title */}
      <div className="flex flex-col items-center justify-center my-3 py-5 px-5 text-center gap-3.5 glass-card rounded-3xl backdrop-blur-2xl border border-theme-subtle shadow-xl shrink-0">
        <div className="relative">
          <Mascot mood="zen" size={84} />
          {/* Subtle floating background arrows with chromatic glow */}
          <svg
            className="absolute -top-3 -left-7 w-7 h-7 text-cyan-400/40 animate-pulse pointer-events-none drop-shadow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <svg
            className="absolute -bottom-2 -right-7 w-6 h-6 text-teal-400/40 animate-pulse pointer-events-none drop-shadow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif text-[var(--theme-text)] drop-shadow-xs">
            {t('appTitle')}
          </h1>
          <p className="text-xs text-[var(--theme-text)] font-semibold mt-1 max-w-[280px] mx-auto leading-relaxed opacity-85">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Primary Play CTA with Luminous Glass Gradient */}
        <button
          onClick={onPlayCurrentLevel}
          className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-xl shadow-cyan-500/25 border border-white/40 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>{t('playLevel', { level: Math.min(500, unlockedLevel) })}</span>
        </button>

        {/* Glassmorphic Progress bar */}
        <div className="w-full mt-1">
          <div className="w-full h-2.5 glass-panel-subtle rounded-full overflow-hidden p-0.5 border border-theme-subtle">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[var(--theme-text)] mt-1.5 font-bold">
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
