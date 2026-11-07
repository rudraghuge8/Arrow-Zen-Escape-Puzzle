/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Play, Check } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { FlameIcon } from './GameIcons';

interface DailyChallengeModalProps {
  streakDays: number;
  isTodayCompleted: boolean;
  language: LanguageCode;
  onPlayDaily: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  streakDays,
  isTodayCompleted,
  language,
  onPlayDaily,
  onClose,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-sm bg-[#fcf6ee] dark:bg-[#252f3b] text-[#6b4528] dark:text-[#e2e8f0] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center border border-black/10 dark:border-white/10">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 transition-transform active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <Mascot mood={isTodayCompleted ? 'happy' : 'zen'} size={64} />

        <div>
          <h2 id="daily-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('dailyChallenge')}
          </h2>
          <p className="text-xs opacity-70 mt-0.5">{todayStr}</p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-3 bg-orange-500/15 text-orange-600 dark:text-orange-300 font-bold px-4 py-2.5 rounded-2xl w-full">
          <FlameIcon size={32} />
          <div className="text-left">
            <p className="text-base leading-tight">{t('dailyStreak', { days: streakDays })}</p>
            <p className="text-[11px] opacity-80">
              {t('streakReward', { coins: Math.min(100, (streakDays + 1) * 10) })}
            </p>
          </div>
        </div>

        {isTodayCompleted ? (
          <div className="py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>You have completed today&apos;s Zen puzzle! Return tomorrow to keep your streak.</span>
          </div>
        ) : (
          <button
            onClick={onPlayDaily}
            className="w-full min-h-[48px] py-3.5 bg-[#c0773a] hover:bg-[#a9652d] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Today&apos;s Puzzle</span>
          </button>
        )}
      </div>
    </div>
  );
};
