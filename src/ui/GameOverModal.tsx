/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tv, RotateCcw } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { DropIcon } from './GameIcons';

interface GameOverModalProps {
  coins: number;
  language: LanguageCode;
  onRetry: () => void;
  onContinueWithCoins: () => void;
  onWatchAdForDrop: () => void;
  onGoToHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  coins,
  language,
  onRetry,
  onContinueWithCoins,
  onWatchAdForDrop,
  onGoToHome,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-sm bg-[#fcf6ee] dark:bg-[#252f3b] text-[#6b4528] dark:text-[#e2e8f0] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center border border-black/10 dark:border-white/10">
        <Mascot mood="worried" size={68} />

        <h2 id="gameover-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t('outOfDrops')}
        </h2>

        <p className="text-sm opacity-80 leading-relaxed text-slate-700 dark:text-slate-300">
          Patience is the key to Zen. Take a breath and try once more.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          {/* Continue with coins if affordable */}
          {coins >= 25 && (
            <button
              onClick={onContinueWithCoins}
              className="w-full min-h-[48px] py-3 bg-[#3fa7e6] hover:bg-[#2b8ee5] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <DropIcon size={20} active />
              <span>{t('continueWithDrop')}</span>
            </button>
          )}

          {/* Watch Ad for +1 Drop */}
          <button
            onClick={onWatchAdForDrop}
            className="w-full min-h-[48px] py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Tv className="w-5 h-5" />
            <span>{t('watchAdForReward', { reward: '1 Drop' })}</span>
          </button>

          {/* Try Again (Free) */}
          <button
            onClick={onRetry}
            className="w-full min-h-[48px] py-3.5 bg-[#c0773a] hover:bg-[#a9652d] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t('tryAgain')}</span>
          </button>

          <button
            onClick={onGoToHome}
            className="w-full py-2.5 text-sm opacity-70 hover:opacity-100 transition-opacity font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
