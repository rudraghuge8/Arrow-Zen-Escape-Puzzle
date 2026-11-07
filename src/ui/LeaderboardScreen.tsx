/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';
import type { LeaderboardEntry } from '../services/types';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { CharacterAvatar, RankMedal, StarIcon } from './GameIcons';

interface LeaderboardScreenProps {
  language: LanguageCode;
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  language,
  onBack,
}) => {
  const [boardType, setBoardType] = useState<'weekly' | 'global'>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    leaderboardService.getLeaderboard(boardType).then((data) => {
      if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [boardType]);

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
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t('leaderboard')}</h2>
        <div className="w-11" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 p-3 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
        <button
          onClick={() => setBoardType('weekly')}
          className={`min-h-[40px] py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
            boardType === 'weekly'
              ? 'bg-[#c0773a] text-white shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          {t('weeklyBoard')}
        </button>
        <button
          onClick={() => setBoardType('global')}
          className={`min-h-[40px] py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
            boardType === 'global'
              ? 'bg-[#c0773a] text-white shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          {t('globalBoard')}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="py-12 text-center text-sm opacity-60">Loading scores...</div>
        ) : (
          entries.map((entry) => {
            const isMe = entry.uid === 'current_user';

            return (
              <div
                key={entry.uid}
                className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  isMe
                    ? 'bg-amber-500/15 border-amber-500 font-bold ring-2 ring-amber-400'
                    : 'bg-white/60 dark:bg-black/30 border-black/10 dark:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 flex items-center justify-center shrink-0">
                    {entry.rank <= 3 ? (
                      <RankMedal rank={entry.rank} size={24} />
                    ) : (
                      <span className="font-extrabold text-sm opacity-60">#{entry.rank}</span>
                    )}
                  </div>

                  <CharacterAvatar id={entry.avatar} size={36} />

                  <div className="text-left leading-tight">
                    <p className="text-sm font-bold truncate max-w-[140px] text-slate-900 dark:text-slate-100">
                      {entry.displayName}
                    </p>
                    <p className="text-[11px] opacity-70 flex items-center gap-1">
                      <span>{entry.levelsCleared} {t('levels')} · {entry.totalStars}</span>
                      <StarIcon size={12} filled />
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold opacity-75">{entry.updatedAt}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
