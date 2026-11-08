/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Gift, Check } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { CoinIcon, BombIcon } from './GameIcons';

interface DailyRewardCalendarProps {
  claimedDayCount: number;
  lastClaimDate: string;
  language: LanguageCode;
  onClaim: (day: number, coins: number) => void;
  onClose: () => void;
}

const REWARDS = [
  { day: 1, coins: 25, hasBomb: false },
  { day: 2, coins: 35, hasBomb: false },
  { day: 3, coins: 50, hasBomb: false },
  { day: 4, coins: 65, hasBomb: false },
  { day: 5, coins: 80, hasBomb: false },
  { day: 6, coins: 100, hasBomb: false },
  { day: 7, coins: 200, hasBomb: true },
];

export const DailyRewardCalendar: React.FC<DailyRewardCalendarProps> = ({
  claimedDayCount,
  lastClaimDate,
  language,
  onClaim,
  onClose,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const todayStr = new Date().toDateString();
  const canClaimToday = lastClaimDate !== todayStr;
  const currentClaimDay = Math.min(7, (claimedDayCount % 7) + 1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-sm glass-card text-[var(--theme-text)] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center border border-theme-subtle">
        {/* Top-left back button */}
        <button
          onClick={onClose}
          aria-label="Back"
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl glass-button transition-transform active:scale-90 text-[var(--theme-text)] border border-theme-subtle cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <Mascot mood="cheering" size={60} />

        <h2 id="calendar-heading" className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">
          {t('dailyReward')}
        </h2>

        {/* 7-Day Grid */}
        <div className="w-full grid grid-cols-4 gap-2 pt-2">
          {REWARDS.map((r) => {
            const isClaimed = r.day <= (claimedDayCount % 7);
            const isReady = r.day === currentClaimDay && canClaimToday;

            return (
              <div
                key={r.day}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all ${
                  r.day === 7 ? 'col-span-2' : ''
                } ${
                  isReady
                    ? 'glass-card border-amber-400 text-amber-300 ring-2 ring-amber-400 font-bold animate-pulse shadow-md'
                    : isClaimed
                      ? 'glass-panel-subtle border-emerald-500/30 text-emerald-400 opacity-80'
                      : 'glass-panel-subtle border-transparent opacity-50'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-75">
                  Day {r.day}
                </span>
                <span className="text-xs font-extrabold my-1 flex items-center justify-center gap-1">
                  <span>{r.coins}</span>
                  <CoinIcon size={12} />
                  {r.hasBomb && (
                    <>
                      <span>+</span>
                      <BombIcon size={12} />
                    </>
                  )}
                </span>
                <span className="text-[10px] flex items-center justify-center gap-0.5">
                  {isClaimed ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Claimed</span>
                    </>
                  ) : isReady ? (
                    'Claim!'
                  ) : (
                    'Locked'
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="w-full pt-2">
          {canClaimToday ? (
            <button
              onClick={() => {
                const target = REWARDS[currentClaimDay - 1];
                onClaim(currentClaimDay, target.coins);
              }}
              className="w-full min-h-[48px] py-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              <span>{t('claimDailyReward', { day: currentClaimDay })}</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full min-h-[48px] py-3.5 glass-button opacity-60 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Claimed for today! Next reward tomorrow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
