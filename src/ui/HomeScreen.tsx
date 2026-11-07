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
    <div className="relative w-full h-full flex flex-col justify-between p-4 max-w-md mx-auto select-none overflow-y-auto">
      {/* Top Header: Profile Chip & Coins & Streak */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs"
        >
          <CharacterAvatar id={profile?.avatar || 'fox'} size={24} />
          <span className="truncate max-w-[100px] text-slate-800 dark:text-slate-100">{profile?.name || t('guest')}</span>
        </button>

        <div className="flex items-center gap-2">
          {streakDays > 0 && (
            <button
              onClick={onOpenDaily}
              className="flex items-center gap-1.5 bg-orange-500/15 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform"
            >
              <FlameIcon size={16} />
              <span>{streakDays}d</span>
            </button>
          )}

          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <CoinIcon size={16} />
            <span>{coins}</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Mascot + Title Lockup */}
      <div className="flex flex-col items-center justify-center my-auto py-6 text-center gap-3">
        <div className="relative">
          <Mascot mood="zen" size={88} />
          {/* Subtle floating background arrows */}
          <svg
            className="absolute -top-4 -left-8 w-8 h-8 text-amber-600/30 animate-pulse pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <svg
            className="absolute -bottom-2 -right-8 w-7 h-7 text-blue-500/30 animate-pulse pointer-events-none"
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
          <h1 className="text-4xl font-extrabold tracking-tight font-serif text-[#42220f] dark:text-[#f8fafc]">
            {t('appTitle')}
          </h1>
          <p className="text-xs text-[#52311b] dark:text-[#cbd5e1] font-semibold mt-1 max-w-[280px] mx-auto leading-relaxed">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Primary Play CTA */}
        <button
          onClick={onPlayCurrentLevel}
          className="w-full mt-4 py-4 px-6 bg-[#b25f23] hover:bg-[#964e19] active:scale-[0.98] text-white font-bold text-xl rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>{t('playLevel', { level: Math.min(500, unlockedLevel) })}</span>
        </button>

        {/* Progress bar */}
        <div className="w-full mt-2">
          <div className="w-full h-2.5 bg-black/15 dark:bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#b25f23] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[#52311b] dark:text-[#cbd5e1] mt-1 font-bold">
            {t('levelsCleared')}: {clearedCount} / 500 ({progressPercent}%)
          </p>
        </div>
      </div>

      {/* Grid of Secondary Menus */}
      <div className="w-full grid grid-cols-2 gap-2.5 mb-2">
        <button
          onClick={onOpenLevels}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <Map className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          <span>{t('levels')}</span>
        </button>

        <button
          onClick={onOpenDaily}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>{t('dailyChallenge')}</span>
        </button>

        <button
          onClick={onOpenCalendar}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <span>{t('dailyReward')}</span>
        </button>

        <button
          onClick={onOpenShop}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('shop')}</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>{t('leaderboard')}</span>
        </button>

        <button
          onClick={onOpenAchievements}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <Medal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>{t('achievements')}</span>
        </button>

        <button
          onClick={onOpenHowToPlay}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>{t('howToPlay')}</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center gap-2.5 py-3 px-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs"
        >
          <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <span>{t('settings')}</span>
        </button>
      </div>
    </div>
  );
};
