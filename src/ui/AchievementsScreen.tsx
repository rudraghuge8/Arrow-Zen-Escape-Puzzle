/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Check, Sprout, Crown, Sparkles, Zap } from 'lucide-react';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { CoinIcon, FlameIcon, StarIcon } from './GameIcons';

interface AchievementsScreenProps {
  unlockedLevel: number;
  totalStars: number;
  flawlessWins: number;
  streakDays: number;
  achievements: Record<string, boolean>;
  language: LanguageCode;
  onClaimReward: (id: string, coins: number) => void;
  onBack: () => void;
}

interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
  rewardCoins: number;
  isUnlocked: (props: AchievementsScreenProps) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_escape',
    title: 'First Escape',
    desc: 'Clear Level 1',
    icon: ({ className }) => <Sprout className={`w-6 h-6 text-emerald-600 dark:text-emerald-400 ${className || ''}`} />,
    rewardCoins: 50,
    isUnlocked: (p) => p.unlockedLevel > 1,
  },
  {
    id: 'zen_apprentice',
    title: 'Zen Apprentice',
    desc: 'Clear 10 levels',
    icon: ({ className }) => <Zap className={`w-6 h-6 text-amber-600 dark:text-amber-400 ${className || ''}`} />,
    rewardCoins: 75,
    isUnlocked: (p) => p.unlockedLevel > 10,
  },
  {
    id: 'world_1_boss',
    title: 'Mindful Master',
    desc: 'Clear World 1 (Level 25)',
    icon: ({ className }) => <Crown className={`w-6 h-6 text-yellow-600 dark:text-yellow-400 ${className || ''}`} />,
    rewardCoins: 150,
    isUnlocked: (p) => p.unlockedLevel > 25,
  },
  {
    id: 'flawless_10',
    title: 'Flawless Path',
    desc: 'Achieve 10 flawless 3-star clears',
    icon: ({ className }) => <Sparkles className={`w-6 h-6 text-purple-600 dark:text-purple-400 ${className || ''}`} />,
    rewardCoins: 100,
    isUnlocked: (p) => p.flawlessWins >= 10,
  },
  {
    id: 'daily_3',
    title: 'Daily Devotee',
    desc: 'Maintain a 3-day daily streak',
    icon: ({ className }) => <FlameIcon size={24} className={className} />,
    rewardCoins: 120,
    isUnlocked: (p) => p.streakDays >= 3,
  },
  {
    id: 'century',
    title: 'Century Solver',
    desc: 'Clear 100 levels',
    icon: ({ className }) => <StarIcon size={24} filled className={className} />,
    rewardCoins: 500,
    isUnlocked: (p) => p.unlockedLevel > 100,
  },
];

export const AchievementsScreen: React.FC<AchievementsScreenProps> = (props) => {
  const { achievements, language, onClaimReward, onBack } = props;

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  return (
    <div className="w-full h-full flex flex-col bg-[#f5e7d3] dark:bg-[#1c242d] text-[#6b4528] dark:text-[#9fb0cb] select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 bg-inherit sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-90 transition-transform text-slate-800 dark:text-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t('achievements')}</h2>
        <div className="w-11" />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = ach.isUnlocked(props);
          const claimed = achievements[ach.id];
          const Icon = ach.icon;

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                unlocked
                  ? 'bg-white/60 dark:bg-black/30 border-black/10 dark:border-white/10'
                  : 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 shrink-0">
                  <Icon />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{ach.title}</h4>
                  <p className="text-xs opacity-70 mt-0.5">{ach.desc}</p>
                </div>
              </div>

              <div>
                {claimed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>Claimed</span>
                  </span>
                ) : unlocked ? (
                  <button
                    onClick={() => onClaimReward(ach.id, ach.rewardCoins)}
                    className="min-h-[44px] px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Claim +{ach.rewardCoins}</span>
                    <CoinIcon size={14} />
                  </button>
                ) : (
                  <span className="text-xs font-bold opacity-40">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
